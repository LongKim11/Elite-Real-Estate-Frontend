package com.realestatemarket.paymentservice.service;

import java.util.List;

import com.realestatemarket.paymentservice.entity.UserPostQuota;
import com.realestatemarket.paymentservice.repository.UserPostQuotaRepository;
import com.realestatemarket.paymentservice.response.ApiResponse;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

import com.realestatemarket.paymentservice.enums.TransactionType;
import com.realestatemarket.paymentservice.enums.UserPostQuotaType;
import com.realestatemarket.paymentservice.kafka.SalesKafkaProducer;
import com.realestatemarket.paymentservice.request.TransactionRequest;
import com.realestatemarket.paymentservice.request.UserPostQuotaRequest;

@Service
public class UserPostQuotaService {

    private final UserPostQuotaRepository userPostQuotaRepository;
    private final SalesKafkaProducer salesKafkaProducer;

    public UserPostQuotaService(UserPostQuotaRepository userPostQuotaRepository, SalesKafkaProducer salesKafkaProducer) {
        this.userPostQuotaRepository = userPostQuotaRepository;
        this.salesKafkaProducer = salesKafkaProducer;
    }

    
    // Get user post quota by userId
    public ApiResponse<List<UserPostQuota>> getUserPostQuota(String userId) {
        Optional<List<UserPostQuota>> quotaOptional = userPostQuotaRepository.findByUserId(userId);
        if (quotaOptional.isPresent() && !quotaOptional.get().isEmpty()) {
            return new ApiResponse<>(true, "User post quota retrieved successfully.", quotaOptional.get(), null);
        }
        return new ApiResponse<>(false, "User post quota not found.", null, "NotFound");
    }

    // Get All User Post Quota
    public ApiResponse<List<UserPostQuota>> getAllUserPostQuota() {
        return new ApiResponse<>(true, "User post quota retrieved successfully.", userPostQuotaRepository.findAll(), null);
    }

    // Get user post quota by userId with expiredAt null
    public ApiResponse<List<UserPostQuota>> getUserPostQuotaValidate(String userId) {
        Optional<List<UserPostQuota>> quotaOptional = userPostQuotaRepository.findByUserId(userId);
    
        if (quotaOptional.isPresent()) {
            List<UserPostQuota> validQuotas = quotaOptional.get().stream()
                .filter(quota -> quota.getExpiredAt() == null)
                .collect(Collectors.toList());
    
            if (!validQuotas.isEmpty()) {
                return new ApiResponse<>(true, "User post quota retrieved successfully.", validQuotas, null);
            }
        }
    
        return new ApiResponse<>(false, "User post quota not found.", null, "NotFound");
    }
    
    // Create or update user post quota
    public ApiResponse<UserPostQuota> createOrUpdateUserPostQuota(UserPostQuotaRequest userPostQuota, String userId) {
        UserPostQuotaType quotaType;
        try {
            quotaType = UserPostQuotaType.valueOf(userPostQuota.getPacketName());
        } catch (IllegalArgumentException e) {
            return new ApiResponse<>(false, "Invalid post tier.", null, "BadRequest");
        }
    
        UserPostQuota userPostQuotaEntity = new UserPostQuota();
        userPostQuotaEntity.setUserId(userId);
        userPostQuotaEntity.setAmountPaid(userPostQuota.getAmount());
    
        switch (quotaType) {
            case BASIC -> {
                userPostQuotaEntity.setVipGoldRemaining(3);
                userPostQuotaEntity.setVipSilverRemaining(5);
                userPostQuotaEntity.setRegularRemaining(10);
                userPostQuotaEntity.setPacketName(quotaType.name());
            }
            case STANDARD -> {
                userPostQuotaEntity.setVipGoldRemaining(5);
                userPostQuotaEntity.setVipSilverRemaining(7);
                userPostQuotaEntity.setRegularRemaining(12);
                userPostQuotaEntity.setPacketName(quotaType.name());
            }
            case VIP -> {
                userPostQuotaEntity.setVipGoldRemaining(9);
                userPostQuotaEntity.setVipSilverRemaining(15);
                userPostQuotaEntity.setRegularRemaining(15);
                userPostQuotaEntity.setPacketName(quotaType.name());
            }
        }

        UserPostQuota savedQuota = userPostQuotaRepository.save(userPostQuotaEntity);
        salesKafkaProducer.sendTransaction(new TransactionRequest(userId, userPostQuota.getAmount(), TransactionType.WITHDRAWAL));

        return new ApiResponse<>(true, "User post quota saved successfully.", savedQuota, null);
    }
}
