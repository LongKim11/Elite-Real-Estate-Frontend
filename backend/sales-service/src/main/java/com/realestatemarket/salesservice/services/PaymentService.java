package com.realestatemarket.salesservice.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.realestatemarket.salesservice.entity.WalletTopup;
import com.realestatemarket.salesservice.enums.TransactionType;
import com.realestatemarket.salesservice.kafka.PaymentKafkaProducer;
import com.realestatemarket.salesservice.repository.WalletTopupRepository;
import com.realestatemarket.salesservice.request.TransactionRequest;
import com.realestatemarket.salesservice.response.ApiResponse;
import com.realestatemarket.salesservice.services.payment.gateway.IPaymentGateway;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class PaymentService {

    private final IPaymentGateway paymentGateway;
    private final WalletTopupRepository walletTopupRepository;
    private final PaymentKafkaProducer paymentKafkaProducer;
    
    public PaymentService(IPaymentGateway paymentGateway, WalletTopupRepository walletTopupRepository, PaymentKafkaProducer paymentKafkaProducer) {
        this.paymentGateway = paymentGateway;
        this.walletTopupRepository = walletTopupRepository;
        this.paymentKafkaProducer = paymentKafkaProducer;
    }

    public ApiResponse<String> createPaymentUrl(long amount, String ipAddress, String userInfor) {
        WalletTopup topup = createTopup(userInfor, amount);
        if (topup == null) {
            return new ApiResponse<>(false, "Create topup failed", null, null);
        }

        String url = paymentGateway.createPaymentUrl(amount, ipAddress, topup.getWalletTopupsId().toString());
        return new ApiResponse<>(true, "Created payment url successfully", url, null);
    }

    public ApiResponse<Map<String, String>> handleReturn(Map<String, String> params, HttpServletResponse response) throws IOException {
        boolean isSuccess = updateTopupFromVNPay(paymentGateway.processReturn(params).getData());


        String amount = params.get("vnp_Amount"); 
        String transactionId = params.get("vnp_OrderInfo");
        String status = isSuccess ? "success" : "failure";
        String bankCode = params.get("vnp_BankCode");

        String redirectUrl = "http://localhost:5173/payment-success" +
                     "?amount=" + amount +
                     "&transactionId=" + transactionId +
                     "&status=" + status +
                     "&bankCode=" + bankCode;

        if (!isSuccess) {
            response.sendRedirect(redirectUrl);
            return new ApiResponse<>(false, "Update topup failed", null, null);
        }
        response.sendRedirect(redirectUrl);
        return new ApiResponse<>(true, "Payment return verified", null, null);
    }

    public ApiResponse<String> handleIPN(Map<String, String> params) {
        return new ApiResponse<>(true, "IPN processed successfully", null, null);
    }

    public ApiResponse<WalletTopup> getTransactionById(UUID id) {
        Optional<WalletTopup> optionalTopup = walletTopupRepository.findById(id);
        if (optionalTopup.isPresent()) {
            return new ApiResponse<>(true, "Transaction found", optionalTopup.get(), null);
        } else {
            return new ApiResponse<>(false, "Transaction not found", null, "No transaction with ID " + id);
        }
    }

    public ApiResponse<List<WalletTopup>> getTransactionsByPhone(String phoneNumber) {
        List<WalletTopup> topups = walletTopupRepository.findByPhoneNumber(phoneNumber);
        if (topups.isEmpty()) {
            return new ApiResponse<>(false, "No transactions found for this phone number", null, "Empty list");
        }
        return new ApiResponse<>(true, "Transactions found", topups, null);
    }

    public ApiResponse<List<WalletTopup>> getAllTransactions() {
        List<WalletTopup> topups = walletTopupRepository.findAll();
        return new ApiResponse<>(true, "All transactions retrieved", topups, null);
    }

    private WalletTopup createTopup(String phoneNumber, double amount) {
        WalletTopup topup = WalletTopup.builder()
                .phoneNumber(phoneNumber)
                .amount(amount)
                .createdTime(LocalDateTime.now())
                .status(false)
                .build();

        return walletTopupRepository.save(topup);
    }

    private boolean updateTopupFromVNPay(Map<String, String> vnpParams) {
        String transactionStatus = vnpParams.get("vnp_TransactionStatus");
        String orderInfo = vnpParams.get("vnp_OrderInfo");
        String vnpPayDate = vnpParams.get("vnp_PayDate");
        if (!"00".equals(transactionStatus) || orderInfo == null) 
            return false;

        try {
            UUID walletTopupId = UUID.fromString(orderInfo);
            Optional<WalletTopup> optionalTopup = walletTopupRepository.findById(walletTopupId);
    
            if (optionalTopup.isPresent()) {
                WalletTopup topup = optionalTopup.get();
                topup.setStatus(true);
    
                if (vnpPayDate != null) {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                    LocalDateTime payDate = LocalDateTime.parse(vnpPayDate, formatter);
                    topup.setCreatedTime(payDate);
                }
    
                walletTopupRepository.save(topup);
                paymentKafkaProducer.sendTransaction(new TransactionRequest(topup.getPhoneNumber(), topup.getAmount(), TransactionType.DEPOSIT));
                return true;
            }
        } catch (Exception e) {}
        return false;
    }
}
