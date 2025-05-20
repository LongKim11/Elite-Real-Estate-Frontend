package com.realestatemarket.paymentservice;

import com.realestatemarket.paymentservice.entity.PostPayment;
import com.realestatemarket.paymentservice.entity.UserPostQuota;
import com.realestatemarket.paymentservice.enums.PaymentType;
import com.realestatemarket.paymentservice.enums.PostTier;
import com.realestatemarket.paymentservice.enums.TransactionType;
import com.realestatemarket.paymentservice.enums.UserPostQuotaType;
import com.realestatemarket.paymentservice.kafka.SalesKafkaProducer;
import com.realestatemarket.paymentservice.repository.PostPaymentRepository;
import com.realestatemarket.paymentservice.repository.UserPostQuotaRepository;
import com.realestatemarket.paymentservice.request.PostPaymentRequest;
import com.realestatemarket.paymentservice.request.TransactionRequest;
import com.realestatemarket.paymentservice.request.UserPostQuotaRequest;
import com.realestatemarket.paymentservice.response.ApiResponse;
import com.realestatemarket.paymentservice.service.PostPaymentService;
import com.realestatemarket.paymentservice.service.UserPostQuotaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostPaymentServiceTest {

    private static final String USER_ID = "user123";
    private static final double DEFAULT_AMOUNT = 200.0;
    private static final UUID POST_ID = UUID.randomUUID();
    private static final UUID QUOTA_ID = UUID.randomUUID();

    @Mock
    private PostPaymentRepository postPaymentRepository;

    @Mock
    private UserPostQuotaRepository userPostQuotaRepository;

    @Mock
    private SalesKafkaProducer salesKafkaProducer;

    @InjectMocks
    private PostPaymentService postPaymentService;

    @InjectMocks
    private UserPostQuotaService userPostQuotaService;

    private PostPaymentRequest postPaymentRequest;
    private UserPostQuotaRequest userPostQuotaRequest;
    private PostPayment postPayment;
    private UserPostQuota userPostQuota;

    @BeforeEach
    void setUp() {
        postPaymentRequest = new PostPaymentRequest();
        postPaymentRequest.setPostId(POST_ID);
        postPaymentRequest.setPostTier(PostTier.VIP_GOLD.name());
        postPaymentRequest.setPaymentType(PaymentType.POST.name());
        postPaymentRequest.setAmount(DEFAULT_AMOUNT);
        postPaymentRequest.setQuotaId(QUOTA_ID);

        userPostQuotaRequest = new UserPostQuotaRequest(UserPostQuotaType.BASIC.name(), DEFAULT_AMOUNT);

        postPayment = PostPayment.builder()
                .id(UUID.randomUUID())
                .userId(USER_ID)
                .postId(POST_ID)
                .postTier(PostTier.VIP_GOLD)
                .paymentType(PaymentType.POST)
                .amount(DEFAULT_AMOUNT)
                .status("SUCCESS")
                .createdAt(LocalDateTime.now())
                .build();

        userPostQuota = UserPostQuota.builder()
                .id(QUOTA_ID)
                .userId(USER_ID)
                .amountPaid(DEFAULT_AMOUNT)
                .packetName(UserPostQuotaType.BASIC.name())
                .vipGoldRemaining(3)
                .vipSilverRemaining(5)
                .regularRemaining(10)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // PostPaymentService Tests

    @Test
    void handlePostPayment_NonPackage_Success() {
        // Arrange
        postPaymentRequest.setPaymentType(PaymentType.POST.name());
        when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
        doNothing().when(salesKafkaProducer).sendTransaction(any(TransactionRequest.class));

        // Act
        ApiResponse<PostPayment> result = postPaymentService.handlePostPayment(postPaymentRequest, USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("PostPayment processed successfully", result.getMessage());
        assertEquals(postPayment, result.getData());
        assertNull(result.getError());

        ArgumentCaptor<TransactionRequest> captor = ArgumentCaptor.forClass(TransactionRequest.class);
        verify(salesKafkaProducer).sendTransaction(captor.capture());
        TransactionRequest transaction = captor.getValue();
        assertEquals(USER_ID, transaction.getUserId());
        assertEquals(DEFAULT_AMOUNT, transaction.getAmount());
        assertEquals(TransactionType.WITHDRAWAL, transaction.getType());
        verify(postPaymentRepository).save(any(PostPayment.class));
    }

    @Test
    void handlePostPayment_Package_Success_QuotaNotDepleted() {
        // Arrange
        postPaymentRequest.setPaymentType(PaymentType.PACKAGE.name());
        userPostQuota.setVipGoldRemaining(1); // Non-zero quota
        postPayment.setPaymentType(PaymentType.PACKAGE); // Fix: Align paymentType with request
        when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
        when(userPostQuotaRepository.findById(QUOTA_ID)).thenReturn(Optional.of(userPostQuota));
        when(userPostQuotaRepository.save(any(UserPostQuota.class))).thenReturn(userPostQuota);

        // Act
        ApiResponse<PostPayment> result = postPaymentService.handlePostPayment(postPaymentRequest, USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("PostPayment processed successfully", result.getMessage());
        assertEquals(postPayment, result.getData());
        assertNull(result.getError());
        assertEquals(0, userPostQuota.getVipGoldRemaining()); // Quota decremented
        assertNull(userPostQuota.getExpiredAt()); // Not depleted
        verify(postPaymentRepository).save(any(PostPayment.class));
        verify(userPostQuotaRepository).findById(QUOTA_ID);
        verify(userPostQuotaRepository).save(any(UserPostQuota.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void handlePostPayment_Package_Success_QuotaDepleted() {
        // Arrange
        postPaymentRequest.setPaymentType(PaymentType.PACKAGE.name());
        userPostQuota.setVipGoldRemaining(1);
        userPostQuota.setVipSilverRemaining(0);
        userPostQuota.setRegularRemaining(0);
        postPayment.setPaymentType(PaymentType.PACKAGE); // Fix: Align paymentType with request
        when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
        when(userPostQuotaRepository.findById(QUOTA_ID)).thenReturn(Optional.of(userPostQuota));
        when(userPostQuotaRepository.save(any(UserPostQuota.class))).thenReturn(userPostQuota);

        // Act
        ApiResponse<PostPayment> result = postPaymentService.handlePostPayment(postPaymentRequest, USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("PostPayment processed successfully", result.getMessage());
        assertEquals(postPayment, result.getData());
        assertNull(result.getError());
        assertEquals(0, userPostQuota.getVipGoldRemaining());
        assertNotNull(userPostQuota.getExpiredAt()); // Quota depleted, expiredAt set
        verify(postPaymentRepository).save(any(PostPayment.class));
        verify(userPostQuotaRepository).findById(QUOTA_ID);
        verify(userPostQuotaRepository).save(any(UserPostQuota.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void handlePostPayment_Package_QuotaNotFound() {
        // Arrange
        postPaymentRequest.setPaymentType(PaymentType.PACKAGE.name());
        postPayment.setPaymentType(PaymentType.PACKAGE); // Fix: Align paymentType with request
        when(postPaymentRepository.save(any(PostPayment.class))).thenReturn(postPayment);
        when(userPostQuotaRepository.findById(QUOTA_ID)).thenReturn(Optional.empty());

        // Act
        ApiResponse<PostPayment> result = postPaymentService.handlePostPayment(postPaymentRequest, USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("PostPayment processed successfully", result.getMessage());
        assertEquals(postPayment, result.getData());
        assertNull(result.getError());
        verify(postPaymentRepository).save(any(PostPayment.class));
        verify(userPostQuotaRepository).findById(QUOTA_ID);
        verify(userPostQuotaRepository, never()).save(any(UserPostQuota.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void handlePostPayment_InvalidPostTier() {
        // Arrange
        postPaymentRequest.setPostTier("INVALID");

        // Act
        ApiResponse<PostPayment> result = postPaymentService.handlePostPayment(postPaymentRequest, USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Failed to process PostPayment", result.getMessage());
        assertNull(result.getData());
        assertNotNull(result.getError());
        verify(postPaymentRepository, never()).save(any(PostPayment.class));
        verify(userPostQuotaRepository, never()).findById(any(UUID.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void handlePostPayment_InvalidPaymentType() {
        // Arrange
        postPaymentRequest.setPaymentType("INVALID");

        // Act
        ApiResponse<PostPayment> result = postPaymentService.handlePostPayment(postPaymentRequest, USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Failed to process PostPayment", result.getMessage());
        assertNull(result.getData());
        assertNotNull(result.getError());
        verify(postPaymentRepository, never()).save(any(PostPayment.class));
        verify(userPostQuotaRepository, never()).findById(any(UUID.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void getPostPaymentById_Success() {
        // Arrange
        UUID paymentId = UUID.randomUUID();
        when(postPaymentRepository.findById(paymentId)).thenReturn(Optional.of(postPayment));

        // Act
        ApiResponse<PostPayment> result = postPaymentService.getPostPaymentById(paymentId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("PostPayment found", result.getMessage());
        assertEquals(postPayment, result.getData());
        assertNull(result.getError());
        verify(postPaymentRepository).findById(paymentId);
    }

    @Test
    void getPostPaymentById_NotFound() {
        // Arrange
        UUID paymentId = UUID.randomUUID();
        when(postPaymentRepository.findById(paymentId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<PostPayment> result = postPaymentService.getPostPaymentById(paymentId);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("PostPayment not found", result.getMessage());
        assertNull(result.getData());
        assertEquals("No PostPayment found with the given ID", result.getError());
        verify(postPaymentRepository).findById(paymentId);
    }

    @Test
    void getAllPostPayments_Success() {
        // Arrange
        List<PostPayment> payments = List.of(postPayment);
        when(postPaymentRepository.findAll()).thenReturn(payments);

        // Act
        ApiResponse<List<PostPayment>> result = postPaymentService.getAllPostPayments();

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("All PostPayments fetched successfully", result.getMessage());
        assertEquals(payments, result.getData());
        assertNull(result.getError());
        verify(postPaymentRepository).findAll();
    }

    @Test
    void getAllPostPayments_Empty() {
        // Arrange
        when(postPaymentRepository.findAll()).thenReturn(List.of());

        // Act
        ApiResponse<List<PostPayment>> result = postPaymentService.getAllPostPayments();

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("All PostPayments fetched successfully", result.getMessage());
        assertTrue(result.getData().isEmpty());
        assertNull(result.getError());
        verify(postPaymentRepository).findAll();
    }

    @Test
    void getPostPaymentsByUserId_Success() {
        // Arrange
        List<PostPayment> payments = List.of(postPayment);
        when(postPaymentRepository.findByUserId(USER_ID)).thenReturn(payments);

        // Act
        ApiResponse<List<PostPayment>> result = postPaymentService.getPostPaymentsByUserId(USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("PostPayments for user fetched successfully", result.getMessage());
        assertEquals(payments, result.getData());
        assertNull(result.getError());
        verify(postPaymentRepository).findByUserId(USER_ID);
    }

    @Test
    void getPostPaymentsByUserId_Empty() {
        // Arrange
        when(postPaymentRepository.findByUserId(USER_ID)).thenReturn(List.of());

        // Act
        ApiResponse<List<PostPayment>> result = postPaymentService.getPostPaymentsByUserId(USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("No PostPayments found for the user", result.getMessage());
        assertNull(result.getData());
        assertEquals("No PostPayments for given userId", result.getError());
        verify(postPaymentRepository).findByUserId(USER_ID);
    }

    // UserPostQuotaService Tests

    @ParameterizedTest
    @CsvSource({
            "BASIC, 3, 5, 10",
            "STANDARD, 5, 7, 12",
            "VIP, 9, 15, 15"
    })
    void createOrUpdateUserPostQuota_Success(String packetName, int vipGold, int vipSilver, int regular) {
        // Arrange
        userPostQuotaRequest = new UserPostQuotaRequest(packetName, DEFAULT_AMOUNT);
        userPostQuota.setPacketName(packetName);
        userPostQuota.setVipGoldRemaining(vipGold);
        userPostQuota.setVipSilverRemaining(vipSilver);
        userPostQuota.setRegularRemaining(regular);

        when(userPostQuotaRepository.save(any(UserPostQuota.class))).thenReturn(userPostQuota);
        doNothing().when(salesKafkaProducer).sendTransaction(any(TransactionRequest.class));

        // Act
        ApiResponse<UserPostQuota> result = userPostQuotaService.createOrUpdateUserPostQuota(userPostQuotaRequest, USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User post quota saved successfully.", result.getMessage());
        assertEquals(userPostQuota, result.getData());
        assertEquals(vipGold, result.getData().getVipGoldRemaining());
        assertEquals(vipSilver, result.getData().getVipSilverRemaining());
        assertEquals(regular, result.getData().getRegularRemaining());
        assertEquals(packetName, result.getData().getPacketName());
        assertEquals(DEFAULT_AMOUNT, result.getData().getAmountPaid());

        ArgumentCaptor<TransactionRequest> captor = ArgumentCaptor.forClass(TransactionRequest.class);
        verify(salesKafkaProducer).sendTransaction(captor.capture());
        TransactionRequest transaction = captor.getValue();
        assertEquals(USER_ID, transaction.getUserId());
        assertEquals(DEFAULT_AMOUNT, transaction.getAmount());
        assertEquals(TransactionType.WITHDRAWAL, transaction.getType());
        verify(userPostQuotaRepository).save(any(UserPostQuota.class));
    }

    @Test
    void createOrUpdateUserPostQuota_InvalidQuotaType() {
        // Arrange
        userPostQuotaRequest = new UserPostQuotaRequest("INVALID", DEFAULT_AMOUNT);

        // Act
        ApiResponse<UserPostQuota> result = userPostQuotaService.createOrUpdateUserPostQuota(userPostQuotaRequest, USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Invalid post tier.", result.getMessage());
        assertNull(result.getData());
        assertEquals("BadRequest", result.getError());
        verify(userPostQuotaRepository, never()).save(any(UserPostQuota.class));
        verify(salesKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void getUserPostQuota_Success() {
        // Arrange
        List<UserPostQuota> quotas = List.of(userPostQuota);
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.of(quotas));

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuota(USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User post quota retrieved successfully.", result.getMessage());
        assertEquals(quotas, result.getData());
        assertNull(result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }

    @Test
    void getUserPostQuota_NotFound() {
        // Arrange
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.empty());

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuota(USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User post quota not found.", result.getMessage());
        assertNull(result.getData());
        assertEquals("NotFound", result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }

    @Test
    void getUserPostQuota_EmptyList() {
        // Arrange
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.of(List.of()));

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuota(USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User post quota not found.", result.getMessage());
        assertNull(result.getData());
        assertEquals("NotFound", result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }

    @Test
    void getAllUserPostQuota_Success() {
        // Arrange
        List<UserPostQuota> quotas = List.of(userPostQuota);
        when(userPostQuotaRepository.findAll()).thenReturn(quotas);

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getAllUserPostQuota();

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User post quota retrieved successfully.", result.getMessage());
        assertEquals(quotas, result.getData());
        assertNull(result.getError());
        verify(userPostQuotaRepository).findAll();
    }

    @Test
    void getAllUserPostQuota_Empty() {
        // Arrange
        when(userPostQuotaRepository.findAll()).thenReturn(List.of());

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getAllUserPostQuota();

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User post quota retrieved successfully.", result.getMessage());
        assertTrue(result.getData().isEmpty());
        assertNull(result.getError());
        verify(userPostQuotaRepository).findAll();
    }

    @Test
    void getUserPostQuotaValidate_Success() {
        // Arrange
        userPostQuota.setExpiredAt(null);
        List<UserPostQuota> quotas = List.of(userPostQuota);
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.of(quotas));

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuotaValidate(USER_ID);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("User post quota retrieved successfully.", result.getMessage());
        assertEquals(quotas, result.getData());
        assertNull(result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }

    @Test
    void getUserPostQuotaValidate_NoValidQuotas_Expired() {
        // Arrange
        userPostQuota.setExpiredAt(LocalDateTime.now().minusDays(1));
        List<UserPostQuota> quotas = List.of(userPostQuota);
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.of(quotas));

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuotaValidate(USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User post quota not found.", result.getMessage());
        assertNull(result.getData());
        assertEquals("NotFound", result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }

    @Test
    void getUserPostQuotaValidate_NoQuotas() {
        // Arrange
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.empty());

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuotaValidate(USER_ID);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("User post quota not found.", result.getMessage());
        assertNull(result.getData());
        assertEquals("NotFound", result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }

    @Test
    void getUserPostQuotaValidate_DepletedQuotas() {
        // Arrange
        userPostQuota.setExpiredAt(null);
        userPostQuota.setVipGoldRemaining(0);
        userPostQuota.setVipSilverRemaining(0);
        userPostQuota.setRegularRemaining(0);
        List<UserPostQuota> quotas = List.of(userPostQuota);
        when(userPostQuotaRepository.findByUserId(USER_ID)).thenReturn(Optional.of(quotas));

        // Act
        ApiResponse<List<UserPostQuota>> result = userPostQuotaService.getUserPostQuotaValidate(USER_ID);

        // Assert
        assertTrue(result.isSuccess()); // Service doesn't check for depleted quotas
        assertEquals("User post quota retrieved successfully.", result.getMessage());
        assertEquals(quotas, result.getData());
        assertNull(result.getError());
        verify(userPostQuotaRepository).findByUserId(USER_ID);
    }
}