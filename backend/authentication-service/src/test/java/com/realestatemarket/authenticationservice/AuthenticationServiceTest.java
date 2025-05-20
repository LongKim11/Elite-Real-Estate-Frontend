package com.realestatemarket.authenticationservice;

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
import com.realestatemarket.authenticationservice.service.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserTierRepository userTierRepository;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User user;
    private UserTier userTier;
    private RegisterRequest registerRequest;
    private AuthenticationRequest authenticationRequest;
    private ChangePasswordRequest changePasswordRequest;
    private UUID userId;
    private String phoneNumber;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        phoneNumber = "1234567890";
        userTier = new UserTier();
        userTier.setName("Default Tier");

        user = User.builder()
                .userId(userId)
                .phone(phoneNumber)
                .password("encodedPassword")
                .fullName("Test User")
                .role(Role.User)
                .userTier(userTier)
                .accountBalance(1000.0)
                .status(false)
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setPhoneNumber(phoneNumber);
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");

        authenticationRequest = new AuthenticationRequest();
        authenticationRequest.setPhoneNumber(phoneNumber);
        authenticationRequest.setPassword("password123");

        changePasswordRequest = new ChangePasswordRequest();
        changePasswordRequest.setCurrentPassword("password123");
        changePasswordRequest.setNewPassword("newPassword123");
    }

    @Test
    void register_Success() {
        // Arrange
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.empty());
        when(userTierRepository.findByIsDefaultTrue()).thenReturn(userTier);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(repository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwtToken");

        // Act
        AuthenticationResponse result = authenticationService.register(registerRequest);

        // Assert
        assertNotNull(result);
        assertEquals("jwtToken", result.getToken());
        assertEquals(userId, result.getId());
        assertEquals("Test User", result.getName());
        assertEquals("User", result.getRole());
        assertEquals(userTier, result.getUserTier());
        verify(repository).save(any(User.class));
        verify(jwtService).generateToken(any(User.class));
    }

    @Test
    void register_PhoneAlreadyExists() {
        // Arrange
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(PhoneExitsException.class, () -> authenticationService.register(registerRequest));
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void authenticate_Success() throws Exception {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(user)).thenReturn("refreshToken");
        when(repository.save(user)).thenReturn(user);

        // Act
        AuthenticationResponse result = authenticationService.authenticate(authenticationRequest, response);

        // Assert
        assertNotNull(result);
        assertEquals("refreshToken", result.getToken());
        assertEquals(userId, result.getId());
        assertEquals("User", result.getRole());
        assertEquals("Test User", result.getName());
        assertEquals(1000.0, result.getBalance());
        assertEquals(userTier, result.getUserTier());
        verify(response).addHeader(eq("Set-Cookie"), anyString());
        verify(repository).save(user);
    }

    @Test
    void authenticate_UserDeactivated() {
        // Arrange
        user.setStatus(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(Exception.class, () -> authenticationService.authenticate(authenticationRequest, response));
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void logout_Success() {
        // Arrange
        Cookie cookie = new Cookie("jwt", "refreshToken");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        when(repository.findByRefreshToken("refreshToken")).thenReturn(Optional.of(user));
        when(repository.save(user)).thenReturn(user);

        // Act
        ResponseEntity<ApiResponse<Void>> result = authenticationService.logout(request, response);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().isSuccess());
        assertEquals("Logged out successfully", result.getBody().getMessage());
        verify(response).addHeader(eq("Set-Cookie"), anyString());
        verify(repository).save(user);
    }

    @Test
    void logout_NoRefreshToken() {
        // Arrange
        Cookie cookie = new Cookie("other", "value");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});

        // Act
        ResponseEntity<ApiResponse<Void>> result = authenticationService.logout(request, response);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertFalse(result.getBody().isSuccess());
        assertEquals("No refresh token found in cookies", result.getBody().getMessage());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void changePassword_Success() {
        // Arrange
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.matches("newPassword123", "encodedPassword")).thenReturn(false);
        when(passwordEncoder.encode("newPassword123")).thenReturn("newEncodedPassword");
        when(repository.save(user)).thenReturn(user);

        // Act
        ApiResponse<String> result = authenticationService.changePassword(phoneNumber, changePasswordRequest);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Change password successful", result.getMessage());
        assertEquals("Password updated successfully", result.getData());
        verify(repository).save(user);
    }

    @Test
    void changePassword_WrongCurrentPassword() {
        // Arrange
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(false);

        // Act
        ApiResponse<String> result = authenticationService.changePassword(phoneNumber, changePasswordRequest);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Change password failed", result.getMessage());
        assertEquals("Current password is incorrect", result.getData());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void getAllUser_Success() {
        // Arrange
        List<User> users = Arrays.asList(user);
        when(repository.findAll()).thenReturn(users);

        // Act
        ResponseEntity<ApiResponse<List<UserDTO>>> result = authenticationService.getAllUser();

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().isSuccess());
        assertEquals("User list retrieved successfully", result.getBody().getMessage());
        assertFalse(result.getBody().getData().isEmpty());
        verify(repository).findAll();
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        when(repository.findByUserId(userId)).thenReturn(Optional.of(user));
        when(repository.save(user)).thenReturn(user);

        // Act
        ResponseEntity<ApiResponse<String>> result = authenticationService.deleteUser(userId);

        // Assert
        assertEquals(HttpStatus.ACCEPTED, result.getStatusCode());
        assertTrue(result.getBody().isSuccess());
        assertEquals("User has been deactivated", result.getBody().getMessage());
        verify(repository).save(user);
    }

    @Test
    void getUserInfoFromToken_Success() {
        // Arrange
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(phoneNumber);
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<ApiResponse<UserDTO>> result = authenticationService.getUserInfoFromToken();

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().isSuccess());
        assertEquals("User information retrieved successfully", result.getBody().getMessage());
        assertNotNull(result.getBody().getData());
        verify(repository).findByPhone(phoneNumber);
    }

    @Test
    void getUserInfo_Success() {
        // Arrange
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<ApiResponse<UserDTO>> result = authenticationService.getUserInfo(phoneNumber);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().isSuccess());
        assertEquals("User information retrieved successfully", result.getBody().getMessage());
        assertNotNull(result.getBody().getData());
        verify(repository).findByPhone(phoneNumber);
    }

    @Test
    void checkAccountBalance_Success_SufficientBalance() {
        // Arrange
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(phoneNumber);
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<ApiResponse<String>> result = authenticationService.checkAccountBalance(500.0);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertTrue(result.getBody().isSuccess());
        assertEquals("Sufficient balance", result.getBody().getMessage());
        verify(repository).findByPhone(phoneNumber);
    }

    @Test
    void checkAccountBalance_InsufficientBalance() {
        // Arrange
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(phoneNumber);
        when(repository.findByPhone(phoneNumber)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<ApiResponse<String>> result = authenticationService.checkAccountBalance(1500.0);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertFalse(result.getBody().isSuccess());
        assertEquals("Insufficient balance", result.getBody().getMessage());
        verify(repository).findByPhone(phoneNumber);
    }
}