package com.realestatemarket.authenticationservice.rest;

import com.realestatemarket.authenticationservice.exception.ChangePasswordException;
import com.realestatemarket.authenticationservice.request.AuthenticationRequest;
import com.realestatemarket.authenticationservice.request.ChangePasswordRequest;
import com.realestatemarket.authenticationservice.request.RegisterRequest;
import com.realestatemarket.authenticationservice.response.ApiResponse;
import com.realestatemarket.authenticationservice.response.AuthenticationResponse;
import com.realestatemarket.authenticationservice.service.AuthenticationService;
import com.realestatemarket.authenticationservice.dto.UserDTO;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.UUID;

@RequestMapping("api/v1/auth")
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    @Autowired
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse authResponse = service.register(request);

            ApiResponse<AuthenticationResponse> apiResponse = new ApiResponse<>(
                    true,
                    "User registered successfully",
                    authResponse,
                    null
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<AuthenticationResponse> errorResponse = new ApiResponse<>(
                    false,
                    "Registration failed",
                    null,
                    e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response) {
        try {
            // Authenticate the user and generate the authentication response
            AuthenticationResponse authResponse = service.authenticate(request, response);

            // Return a success response with the authentication details
            ApiResponse<AuthenticationResponse> apiResponse = new ApiResponse<>(
                    true, "Login successful", authResponse, null);
            return ResponseEntity.ok(apiResponse);
        } catch (EntityNotFoundException e) {
            // Handle the case where the user does not exist
            ApiResponse<AuthenticationResponse> errorResponse = new ApiResponse<>(
                    false, "User not found", null, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (BadCredentialsException e) {
            // Handle incorrect phone/email or password
            ApiResponse<AuthenticationResponse> errorResponse = new ApiResponse<>(
                    false, "Invalid credentials", null, "Incorrect phone/email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            // Handle unexpected errors
            ApiResponse<AuthenticationResponse> errorResponse = new ApiResponse<>(
                    false, "Login failed", null, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        return service.logout(request, response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            ApiResponse<String> response = service.changePassword(userDetails.getUsername(), request);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<String> errorResponse = new ApiResponse<>(false, "User not found", null, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (ChangePasswordException e) {
            ApiResponse<String> errorResponse = new ApiResponse<>(false, "Password change failed", null, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            ApiResponse<String> errorResponse = new ApiResponse<>(false, "An unexpected error occurred", null, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {
        return service.getUserInfoFromToken();
    }

    @GetMapping("/detail/{phone}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserInfo(@PathVariable String phone) {
        return service.getUserInfo(phone);
    }

    @GetMapping("/check-balance/{amount}")
    public ResponseEntity<ApiResponse<String>> checkBalance(@PathVariable double amount) {
        return service.checkAccountBalance(amount);
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<?> getAllUser(){
        return service.getAllUser();
    }

    @DeleteMapping("/admin/user/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable("id") UUID id) {
        return service.deleteUser(id);
    }
}
