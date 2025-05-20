package com.realestatemarket.authenticationservice.service;

import com.realestatemarket.authenticationservice.dao.UserRepository;
import com.realestatemarket.authenticationservice.dto.UserDTO;
import com.realestatemarket.authenticationservice.entity.User;
import com.realestatemarket.authenticationservice.entity.UserTier;
import com.realestatemarket.authenticationservice.enums.Role;
import com.realestatemarket.authenticationservice.exception.PhoneExitsException;
import com.realestatemarket.authenticationservice.jwt.JwtService;
import com.realestatemarket.authenticationservice.repository.UserTierRepository;
import com.realestatemarket.authenticationservice.request.AuthenticationRequest;
import com.realestatemarket.authenticationservice.request.ChangePasswordRequest;
import com.realestatemarket.authenticationservice.request.RegisterRequest;
import com.realestatemarket.authenticationservice.response.ApiResponse;
import com.realestatemarket.authenticationservice.response.AuthenticationResponse;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserTierRepository userTierRepository;

    // Register
    public AuthenticationResponse register(RegisterRequest request) {
        repository.findByPhone(request.getPhoneNumber())
                .ifPresent(user -> {throw new PhoneExitsException("Phone number already in use");
                });

        var user = User.builder()
                .phone(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.User)
                .build();
        

        UserTier defaultTier = userTierRepository.findByIsDefaultTrue();
        user.setUserTier(defaultTier);
        user.setAccountBalance(0.0);

        var newUSer = repository.save(user);
        var jwt = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .role(newUSer.getRole().toString())
                .id(newUSer.getUserId() )
                .name(newUSer.getFullName())
                .token(jwt)
                .userTier(user.getUserTier())
                .build();
    }

    // Login
    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) throws Exception {
        authenticateUser(request.getPhoneNumber(), request.getPassword());
        var user = repository.findByPhone(request.getPhoneNumber())
                .orElseThrow(() -> new EntityNotFoundException("User not found for phone: " + request.getPhoneNumber()));
        if (user.isStatus()) {
            throw new Exception("User account is deactivated");
        }

        String role = user.getRole().toString();
        String name = user.getFullName();

        // Generate token
        var jwtToken = jwtService.generateToken(user);

        // Handle refresh token
        var refreshToken = jwtService.generateRefreshToken(user);

        // Send cookie
        final ResponseCookie responseCookie =  ResponseCookie
                .from("jwt",refreshToken)
                .secure(true)
                .httpOnly(true)
                .path("/api/v1/auth")
                .maxAge(60*60).sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE,responseCookie.toString());
        user.setRefreshToken(refreshToken);
        repository.save(user);
        return AuthenticationResponse.builder()
                .id(user.getUserId())
                .role(role)
                .name(name)
                .balance(user.getAccountBalance())
                .token(refreshToken)
                .userTier(user.getUserTier())
                .build();
    }

    // Logout
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "No cookies found", null, null));
        }

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("jwt".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(new ApiResponse<>(false, "No refresh token found in cookies", null, null));
        }

        var user = repository.findByRefreshToken(refreshToken)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid refresh token", null, "Token not found"));
        }

        user.setRefreshToken(null);
        repository.save(user);

        final ResponseCookie responseCookie = ResponseCookie.from("jwt", "")
                .secure(true)
                .httpOnly(true)
                .path("/api/v1/auth")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null, null));
    }

    // Change Password
    public ApiResponse<String> changePassword(String phone, ChangePasswordRequest request) {
        // Retrieve the user by phone
        var user = repository.findByPhone(phone)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Verify the old password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return new ApiResponse<>(false, "Change password failed", "Current password is incorrect", null);
        }

        // Prevent using the same password again
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            return new ApiResponse<>(false, "Change password failed", "New password must be different from the old password", null);
        }

        // Encrypt and save the new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);

        return new ApiResponse<>(true, "Change password successful", "Password updated successfully", null);
    }

    // Get All Users
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUser() {
        try {
            List<User> users = repository.findAll().stream().filter(user -> user.getRole().equals(Role.User)).toList();
            List<UserDTO> userDTOS = users.stream().map(UserDTO::toDTO).toList();
            return ResponseEntity.ok(new ApiResponse<>(true, "User list retrieved successfully", userDTOS, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving user list", null, e.getMessage()));
        }
    }

    // Block user
    public ResponseEntity<ApiResponse<String>> deleteUser(UUID id) {
        var user = repository.findByUserId(id).orElse(null);

        if (user == null) {
            ApiResponse<String> errorResponse = new ApiResponse<>(false, "User not found", null, null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }

        user.setStatus(!user.isStatus());
        repository.save(user);

        ApiResponse<String> response = new ApiResponse<>(true, "User has been deactivated", null, null);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    // Authentication User
    private void authenticateUser(String numberPhone, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(numberPhone, password));
        } catch (Exception e) {
            throw new RuntimeException("Invalid number phone or password", e);
        }
    }

    // Get me
    public ResponseEntity<ApiResponse<UserDTO>> getUserInfoFromToken() {
        try {
            String phone = SecurityContextHolder.getContext().getAuthentication().getName();

            var user = repository.findByPhone(phone)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with phone: " + phone));

            if (user.isStatus()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "User account is deactivated", null, null));
            }

            UserDTO userDTO = UserDTO.toDTO(user);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "User information retrieved successfully", userDTO, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving user info", null, e.getMessage()));
        }
    }

    // Get detail user
    public ResponseEntity<ApiResponse<UserDTO>> getUserInfo(String phone) {
        try {
            var user = repository.findByPhone(phone)
                    .orElse(null);
    
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "User not found with phone: " + phone, null, null));
            }
    
            UserDTO userDTO = UserDTO.toDTO(user);
    
            return ResponseEntity.ok(new ApiResponse<>(true, "User information retrieved successfully", userDTO, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving user info", null, e.getMessage()));
        }
    }

    // Check accout balance
    public ResponseEntity<ApiResponse<String>> checkAccountBalance(double amount) {
        try {
            String phone = SecurityContextHolder.getContext().getAuthentication().getName();
            var user = repository.findByPhone(phone)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with phone: " + phone));
            
            UserDTO userDTO = UserDTO.toDTO(user);

            if (userDTO.isInActive()) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse<>(false, "User account is deactivated", null, null));
            }

            // Check if the user has sufficient balance
            if (userDTO.getBalance() >= amount) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Sufficient balance", null, null));
            } else {
                return ResponseEntity.status(400)
                        .body(new ApiResponse<>(false, "Insufficient balance", null, null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Error retrieving account balance", null, e.getMessage()));
        }
    }
}
