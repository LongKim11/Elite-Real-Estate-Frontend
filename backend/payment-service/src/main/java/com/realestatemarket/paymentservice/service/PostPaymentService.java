package com.realestatemarket.paymentservice.service;

import java.time.LocalDateTime;

import com.realestatemarket.paymentservice.entity.PostPayment;
import com.realestatemarket.paymentservice.entity.UserPostQuota;
import com.realestatemarket.paymentservice.repository.PostPaymentRepository;
import com.realestatemarket.paymentservice.repository.UserPostQuotaRepository;
import com.realestatemarket.paymentservice.response.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.cglib.core.Local;

import com.realestatemarket.paymentservice.enums.PaymentType;
import com.realestatemarket.paymentservice.enums.PostTier;
import com.realestatemarket.paymentservice.enums.TransactionType;
import com.realestatemarket.paymentservice.kafka.SalesKafkaProducer;
import com.realestatemarket.paymentservice.request.PostPaymentRequest;
import com.realestatemarket.paymentservice.request.TransactionRequest;

@Service
public class PostPaymentService {

    private final PostPaymentRepository postPaymentRepository;
    private final UserPostQuotaRepository userPostQuotaRepository;
    private final SalesKafkaProducer salesKafkaProducer;

    public PostPaymentService(PostPaymentRepository postPaymentRepository,
                              UserPostQuotaRepository userPostQuotaRepository,
                              SalesKafkaProducer salesKafkaProducer) {
        this.postPaymentRepository = postPaymentRepository;
        this.userPostQuotaRepository = userPostQuotaRepository;
        this.salesKafkaProducer = salesKafkaProducer;
    }

    // Create a new PostPayment or update an existing one.
    public ApiResponse<PostPayment> handlePostPayment(PostPaymentRequest postPaymentRequest, String userId) {
        try {
            PostPayment postPayment = new PostPayment();
            postPayment.setUserId(userId);
            postPayment.setPostId(postPaymentRequest.getPostId());
            postPayment.setPostTier(PostTier.fromString(postPaymentRequest.getPostTier()));
            postPayment.setPaymentType(PaymentType.fromString(postPaymentRequest.getPaymentType()));
            postPayment.setAmount(postPaymentRequest.getAmount());

            PostPayment savedPayment = postPaymentRepository.save(postPayment);
            if (savedPayment.getPaymentType().toString().equals("PACKAGE")) {
                Optional<UserPostQuota> quotaOptional = userPostQuotaRepository.findById(postPaymentRequest.getQuotaId());
                if (quotaOptional.isPresent()) {
                    UserPostQuota userPostQuota = quotaOptional.get();
                    boolean success = savedPayment.updateUserPostQuota(userPostQuota);

                    if(success) { 
                        userPostQuota.setExpiredAt(LocalDateTime.now());
                    }
                    userPostQuotaRepository.save(userPostQuota);
                }
            } else {
                salesKafkaProducer.sendTransaction(new TransactionRequest(userId, postPaymentRequest.getAmount(), TransactionType.WITHDRAWAL));
            }
            return new ApiResponse<>(true, "PostPayment processed successfully", savedPayment, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to process PostPayment", null, e.getMessage());
        }
    }

    // Find PostPayment by ID.
    public ApiResponse<PostPayment> getPostPaymentById(UUID id) {
        try {
            Optional<PostPayment> postPayment = postPaymentRepository.findById(id);
            if (postPayment.isPresent()) {
                return new ApiResponse<>(true, "PostPayment found", postPayment.get(), null);
            } else {
                return new ApiResponse<>(false, "PostPayment not found", null, "No PostPayment found with the given ID");
            }
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to fetch PostPayment by ID", null, e.getMessage());
        }
    }

    // Get all PostPayments.
    public ApiResponse<List<PostPayment>> getAllPostPayments() {
        try {
            List<PostPayment> postPayments = postPaymentRepository.findAll();
            return new ApiResponse<>(true, "All PostPayments fetched successfully", postPayments, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to fetch PostPayments", null, e.getMessage());
        }
    }

    /// Get PostPayments by userId.
    public ApiResponse<List<PostPayment>> getPostPaymentsByUserId(String userId) {
        try {
            List<PostPayment> postPayments = postPaymentRepository.findByUserId(userId);
            if (!postPayments.isEmpty()) {
                return new ApiResponse<>(true, "PostPayments for user fetched successfully", postPayments, null);
            } else {
                return new ApiResponse<>(false, "No PostPayments found for the user", null, "No PostPayments for given userId");
            }
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to fetch PostPayments by userId", null, e.getMessage());
        }
    }
}
