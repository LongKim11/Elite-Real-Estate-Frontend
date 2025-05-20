package com.realestatemarket.paymentservice;

import com.realestatemarket.paymentservice.entity.PostPayment;
import com.realestatemarket.paymentservice.entity.UserPostQuota;
import com.realestatemarket.paymentservice.enums.PaymentType;
import com.realestatemarket.paymentservice.enums.PostTier;
import com.realestatemarket.paymentservice.kafka.SalesKafkaProducer;
import com.realestatemarket.paymentservice.repository.PostPaymentRepository;
import com.realestatemarket.paymentservice.repository.UserPostQuotaRepository;
import com.realestatemarket.paymentservice.request.PostPaymentRequest;
import com.realestatemarket.paymentservice.request.TransactionRequest;
import com.realestatemarket.paymentservice.response.ApiResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.realestatemarket.paymentservice.service.PostPaymentService;

@SpringBootTest
class PaymentServiceApplicationTests {

    @Autowired
    private PostPaymentService postPaymentService;

    @MockBean
    private PostPaymentRepository postPaymentRepository;

    @MockBean
    private UserPostQuotaRepository userPostQuotaRepository;

    @MockBean
    private SalesKafkaProducer salesKafkaProducer;

    private PostPaymentRequest postPaymentRequest;
    private PostPayment postPayment;
    private UserPostQuota userPostQuota;
    private String userId;
    private UUID postPaymentId;
    private UUID postId;
    private UUID quotaId;

    @BeforeEach
    void setUp() {
        userId = "user123";
        postPaymentId = UUID.randomUUID();
        postId = UUID.randomUUID();
        quotaId = UUID.randomUUID();

        postPaymentRequest = new PostPaymentRequest();
        postPaymentRequest.setPostId(postId);
        postPaymentRequest.setPostTier("REGULAR");
        postPaymentRequest.setPaymentType("PACKAGE");
        postPaymentRequest.setAmount(100.0);
        postPaymentRequest.setQuotaId(quotaId);

        postPayment = new PostPayment();
        postPayment.setId(postPaymentId);
        postPayment.setUserId(userId);
        postPayment.setPostId(postId);
        postPayment.setPostTier(PostTier.REGULAR);
        postPayment.setPaymentType(PaymentType.PACKAGE);
        postPayment.setAmount(100.0);

        userPostQuota = new UserPostQuota();
        userPostQuota.setId(quotaId);
        userPostQuota.setUserId(userId);
    }

    @Test
    void contextLoads() {
    }

    // @Test
    // void handlePostPayment_PackagePayment_Success() {
    //     // Arrange
    //     when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
    //     when(userPostQuotaRepository.findById(quotaId)).thenReturn(Optional.of(userPostQuota));
    //     when(userPostQuotaRepository.save(any(UserPostQuota.class))).thenReturn(userPostQuota);

    //     // Act
    //     ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPaymentRequest, userId);

    //     // Assert
    //     assertTrue(response.isSuccess(), "Response should be successful");
    //     assertEquals("PostPayment processed successfully", response.getMessage());
    //     assertEquals(postPayment, response.getData());
    //     assertNull(response.getError());
    //     verify(postPaymentRepository, times(1)).save(any(PostPayment.class));
    //     verify(userPostQuotaRepository, times(1)).findById(quotaId);
    //     verify(userPostQuotaRepository, times(1)).save(any(UserPostQuota.class));
    //     verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    // }

    @Test
    void handlePostPayment_NonPackagePayment_Success() {
        // Arrange
        postPaymentRequest.setPaymentType("POST");
        postPayment.setPaymentType(PaymentType.POST);
        when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);

        // Act
        ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPaymentRequest, userId);

        // Assert
        assertTrue(response.isSuccess(), "Response should be successful");
        assertEquals("PostPayment processed successfully", response.getMessage());
        assertEquals(postPayment, response.getData());
        assertNull(response.getError());
        verify(postPaymentRepository, times(1)).save(any(PostPayment.class));
        verify(salesKafkaProducer, times(1)).sendTransaction(any(TransactionRequest.class));
        verify(userPostQuotaRepository, never()).findById(any(UUID.class));
    }

    // @Test
    // void handlePostPayment_InvalidPostTier_Failure() {
    //     // Arrange
    //     postPaymentRequest.setPostTier("INVALID_TIER");
    //     when(postPaymentRepository.save(any(PostPayment.class))).thenThrow(new IllegalArgumentException("Invalid PostTier"));

    //     // Act
    //     ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPaymentRequest, userId);

    //     // Assert
    //     assertFalse(response.isSuccess(), "Response should not be successful");
    //     assertEquals("Failed to process PostPayment", response.getMessage());
    //     assertNull(response.getData());
    //     assertEquals("Invalid PostTier", response.getError());
    //     verify(postPaymentRepository, times(1)).save(any(PostPayment.class));
    //     verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    //     verify(userPostQuotaRepository, never()).findById(any(UUID.class));
    // }

    @Test
    void handlePostPayment_MissingUserPostQuota_Failure() {
        // Arrange
        when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
        when(userPostQuotaRepository.findById(quotaId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPaymentRequest, userId);

        // Assert
        assertTrue(response.isSuccess(), "Response should be successful but no quota update");
        assertEquals("PostPayment processed successfully", response.getMessage());
        assertEquals(postPayment, response.getData());
        assertNull(response.getError());
        verify(postPaymentRepository, times(1)).save(any(PostPayment.class));
        verify(userPostQuotaRepository, times(1)).findById(quotaId);
        verify(userPostQuotaRepository, never()).save(any(UserPostQuota.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    // @Test
    // void handlePostPayment_UpdateQuotaFailure_SuccessWithoutExpiry() {
    //     // Arrange
    //     when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
    //     when(userPostQuotaRepository.findById(quotaId)).thenReturn(Optional.of(userPostQuota));
    //     when(postPayment.updateUserPostQuota(any(UserPostQuota.class))).thenReturn(false);
    //     when(userPostQuotaRepository.save(any(UserPostQuota.class))).thenReturn(userPostQuota);

    //     // Act
    //     ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPaymentRequest, userId);

    //     // Assert
    //     assertTrue(response.isSuccess(), "Response should be successful");
    //     assertEquals("PostPayment processed successfully", response.getMessage());
    //     assertEquals(postPayment, response.getData());
    //     assertNull(response.getError());
    //     verify(postPaymentRepository, times(1)).save(any(PostPayment.class));
    //     verify(userPostQuotaRepository, times(1)).findById(quotaId);
    //     verify(userPostQuotaRepository, times(1)).save(any(UserPostQuota.class));
    //     verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    //     assertNull(userPostQuota.getExpiredAt(), "ExpiredAt should not be set");
    // }

    @Test
    void handlePostPayment_RepositoryFailure() {
        // Arrange
        when(postPaymentRepository.save(any(PostPayment.class))).thenThrow(new RuntimeException("Database error"));

        // Act
        ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPaymentRequest, userId);

        // Assert
        assertFalse(response.isSuccess(), "Response should not be successful");
        assertEquals("Failed to process PostPayment", response.getMessage());
        assertNull(response.getData());
        assertEquals("Database error", response.getError());
        verify(postPaymentRepository, times(1)).save(any(PostPayment.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
        verify(userPostQuotaRepository, never()).findById(any(UUID.class));
    }

    @Test
    void getPostPaymentById_Success() {
        // Arrange
        when(postPaymentRepository.findById(postPaymentId)).thenReturn(Optional.of(postPayment));

        // Act
        ApiResponse<PostPayment> response = postPaymentService.getPostPaymentById(postPaymentId);

        // Assert
        assertTrue(response.isSuccess(), "Response should be successful");
        assertEquals("PostPayment found", response.getMessage());
        assertEquals(postPayment, response.getData());
        assertNull(response.getError());
        verify(postPaymentRepository, times(1)).findById(postPaymentId);
    }

    @Test
    void getPostPaymentById_NotFound() {
        // Arrange
        when(postPaymentRepository.findById(postPaymentId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<PostPayment> response = postPaymentService.getPostPaymentById(postPaymentId);

        // Assert
        assertFalse(response.isSuccess(), "Response should not be successful");
        assertEquals("PostPayment not found", response.getMessage());
        assertNull(response.getData());
        assertEquals("No PostPayment found with the given ID", response.getError());
        verify(postPaymentRepository, times(1)).findById(postPaymentId);
    }

    @Test
    void getAllPostPayments_Success() {
        // Arrange
        List<PostPayment> postPayments = Arrays.asList(postPayment);
        when(postPaymentRepository.findAll()).thenReturn(postPayments);

        // Act
        ApiResponse<List<PostPayment>> response = postPaymentService.getAllPostPayments();

        // Assert
        assertTrue(response.isSuccess(), "Response should be successful");
        assertEquals("All PostPayments fetched successfully", response.getMessage());
        assertEquals(postPayments, response.getData());
        assertNull(response.getError());
        verify(postPaymentRepository, times(1)).findAll();
    }

    @Test
    void getAllPostPayments_Failure() {
        // Arrange
        when(postPaymentRepository.findAll()).thenThrow(new RuntimeException("Database error"));

        // Act
        ApiResponse<List<PostPayment>> response = postPaymentService.getAllPostPayments();

        // Assert
        assertFalse(response.isSuccess(), "Response should not be successful");
        assertEquals("Failed to fetch PostPayments", response.getMessage());
        assertNull(response.getData());
        assertEquals("Database error", response.getError());
        verify(postPaymentRepository, times(1)).findAll();
    }

    @Test
    void getPostPaymentsByUserId_Success() {
        // Arrange
        List<PostPayment> postPayments = Arrays.asList(postPayment);
        when(postPaymentRepository.findByUserId(userId)).thenReturn(postPayments);

        // Act
        ApiResponse<List<PostPayment>> response = postPaymentService.getPostPaymentsByUserId(userId);

        // Assert
        assertTrue(response.isSuccess(), "Response should be successful");
        assertEquals("PostPayments for user fetched successfully", response.getMessage());
        assertEquals(postPayments, response.getData());
        assertNull(response.getError());
        verify(postPaymentRepository, times(1)).findByUserId(userId);
    }

    @Test
    void getPostPaymentsByUserId_NotFound() {
        // Arrange
        when(postPaymentRepository.findByUserId(userId)).thenReturn(Arrays.asList());

        // Act
        ApiResponse<List<PostPayment>> response = postPaymentService.getPostPaymentsByUserId(userId);

        // Assert
        assertFalse(response.isSuccess(), "Response should not be successful");
        assertEquals("No PostPayments found for the user", response.getMessage());
        assertNull(response.getData());
        assertEquals("No PostPayments for given userId", response.getError());
        verify(postPaymentRepository, times(1)).findByUserId(userId);
    }
}