package com.realestatemarket.salesservice;

import com.realestatemarket.salesservice.entity.WalletTopup;
import com.realestatemarket.salesservice.enums.TransactionType;
import com.realestatemarket.salesservice.kafka.PaymentKafkaProducer;
import com.realestatemarket.salesservice.repository.WalletTopupRepository;
import com.realestatemarket.salesservice.request.TransactionRequest;
import com.realestatemarket.salesservice.response.ApiResponse;
import com.realestatemarket.salesservice.services.payment.gateway.IPaymentGateway;

import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.realestatemarket.salesservice.services.PaymentService;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private IPaymentGateway paymentGateway;

    @Mock
    private WalletTopupRepository walletTopupRepository;

    @Mock
    private PaymentKafkaProducer paymentKafkaProducer;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private PaymentService paymentService;

    private WalletTopup walletTopup;
    private UUID walletTopupId;

    @BeforeEach
    void setUp() {
        walletTopupId = UUID.randomUUID();
        walletTopup = WalletTopup.builder()
                .walletTopupsId(walletTopupId)
                .phoneNumber("1234567890")
                .amount(1000.0)
                .createdTime(LocalDateTime.now())
                .status(false)
                .build();
    }

    @Test
    void createPaymentUrl_Success() {
        // Arrange
        long amount = 1000L;
        String ipAddress = "127.0.0.1";
        String userInfor = "1234567890";
        String paymentUrl = "http://payment.url";

        when(walletTopupRepository.save(any(WalletTopup.class))).thenReturn(walletTopup);
        when(paymentGateway.createPaymentUrl(amount, ipAddress, walletTopupId.toString())).thenReturn(paymentUrl);

        // Act
        ApiResponse<String> result = paymentService.createPaymentUrl(amount, ipAddress, userInfor);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Created payment url successfully", result.getMessage());
        assertEquals(paymentUrl, result.getData());
        verify(walletTopupRepository).save(any(WalletTopup.class));
        verify(paymentGateway).createPaymentUrl(amount, ipAddress, walletTopupId.toString());
    }

    @Test
    void createPaymentUrl_Failure() {
        // Arrange
        long amount = 1000L;
        String ipAddress = "127.0.0.1";
        String userInfor = "1234567890";

        when(walletTopupRepository.save(any(WalletTopup.class))).thenReturn(null);

        // Act
        ApiResponse<String> result = paymentService.createPaymentUrl(amount, ipAddress, userInfor);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Create topup failed", result.getMessage());
        assertNull(result.getData());
        verify(walletTopupRepository).save(any(WalletTopup.class));
        verify(paymentGateway, never()).createPaymentUrl(anyLong(), anyString(), anyString());
    }

    @Test
    void handleReturn_Success() throws IOException {
        // Arrange
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TransactionStatus", "00");
        params.put("vnp_OrderInfo", walletTopupId.toString());
        params.put("vnp_PayDate", "20250513205100");
        params.put("vnp_Amount", "1000000");
        params.put("vnp_BankCode", "NCB");

        Map<String, String> paymentData = new HashMap<>(params);
        ApiResponse<Map<String, String>> gatewayResponse = new ApiResponse<>(true, "Success", paymentData, null);

        when(paymentGateway.processReturn(params)).thenReturn(gatewayResponse);
        when(walletTopupRepository.findById(walletTopupId)).thenReturn(Optional.of(walletTopup));
        when(walletTopupRepository.save(any(WalletTopup.class))).thenReturn(walletTopup);

        // Act
        ApiResponse<Map<String, String>> result = paymentService.handleReturn(params, response);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Payment return verified", result.getMessage());
        assertNull(result.getData());
        verify(response).sendRedirect(contains("status=success"));
        verify(paymentKafkaProducer).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void handleReturn_Failure() throws IOException {
        // Arrange
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TransactionStatus", "01");
        params.put("vnp_OrderInfo", walletTopupId.toString());
        params.put("vnp_Amount", "1000000");
        params.put("vnp_BankCode", "NCB");

        Map<String, String> paymentData = new HashMap<>(params);
        ApiResponse<Map<String, String>> gatewayResponse = new ApiResponse<>(true, "Success", paymentData, null);

        when(paymentGateway.processReturn(params)).thenReturn(gatewayResponse);

        // Act
        ApiResponse<Map<String, String>> result = paymentService.handleReturn(params, response);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Update topup failed", result.getMessage());
        assertNull(result.getData());
        verify(response).sendRedirect(contains("status=failure"));
        verify(paymentKafkaProducer, never()).sendTransaction(any(TransactionRequest.class));
    }

    @Test
    void handleIPN_Success() {
        // Arrange
        Map<String, String> params = new HashMap<>();

        // Act
        ApiResponse<String> result = paymentService.handleIPN(params);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("IPN processed successfully", result.getMessage());
        assertNull(result.getData());
    }

    @Test
    void getTransactionById_Success() {
        // Arrange
        when(walletTopupRepository.findById(walletTopupId)).thenReturn(Optional.of(walletTopup));

        // Act
        ApiResponse<WalletTopup> result = paymentService.getTransactionById(walletTopupId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Transaction found", result.getMessage());
        assertEquals(walletTopup, result.getData());
    }

    @Test
    void getTransactionById_Failure() {
        // Arrange
        when(walletTopupRepository.findById(walletTopupId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<WalletTopup> result = paymentService.getTransactionById(walletTopupId);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Transaction not found", result.getMessage());
        assertNull(result.getData());
        assertEquals("No transaction with ID " + walletTopupId, result.getError());
    }

    @Test
    void getTransactionsByPhone_Success() {
        // Arrange
        String phoneNumber = "1234567890";
        List<WalletTopup> topups = List.of(walletTopup);
        when(walletTopupRepository.findByPhoneNumber(phoneNumber)).thenReturn(topups);

        // Act
        ApiResponse<List<WalletTopup>> result = paymentService.getTransactionsByPhone(phoneNumber);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Transactions found", result.getMessage());
        assertEquals(topups, result.getData());
    }

    @Test
    void getTransactionsByPhone_Failure() {
        // Arrange
        String phoneNumber = "1234567890";
        when(walletTopupRepository.findByPhoneNumber(phoneNumber)).thenReturn(List.of());

        // Act
        ApiResponse<List<WalletTopup>> result = paymentService.getTransactionsByPhone(phoneNumber);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("No transactions found for this phone number", result.getMessage());
        assertNull(result.getData());
        assertEquals("Empty list", result.getError());
    }

    @Test
    void getAllTransactions_Success() {
        // Arrange
        List<WalletTopup> topups = List.of(walletTopup);
        when(walletTopupRepository.findAll()).thenReturn(topups);

        // Act
        ApiResponse<List<WalletTopup>> result = paymentService.getAllTransactions();

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("All transactions retrieved", result.getMessage());
        assertEquals(topups, result.getData());
    }
}