package com.realestatemarket.paymentservice.service;

import com.realestatemarket.paymentservice.enums.PaymentType;
import com.realestatemarket.paymentservice.enums.PostTier;
import com.realestatemarket.paymentservice.repository.PostPaymentRepository;
import com.realestatemarket.paymentservice.repository.UserPostQuotaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.realestatemarket.paymentservice.response.ApiResponse;

@Service
@RequiredArgsConstructor
public class SalesStatisticsService {

    private final PostPaymentRepository postPaymentRepository;
    private final UserPostQuotaRepository userPostQuotaRepository;

    /**
     * Count payments by payment type and post tier
     */
    public Map<String, Map<String, Long>> getPaymentCountsByTypeAndTier() {
        Map<String, Map<String, Long>> counts = new HashMap<>();
        
        for (PaymentType paymentType : PaymentType.values()) {
            Map<String, Long> tierCounts = new HashMap<>();
            for (PostTier postTier : PostTier.values()) {
                Long count = postPaymentRepository.countByPaymentTypeAndPostTier(paymentType, postTier);
                tierCounts.put(postTier.name(), count);
            }
            counts.put(paymentType.name(), tierCounts);
        }
        
        return counts;
    }

    /**
     * Calculate total payment amount by status and post tier
     */
    public Map<String, Map<String, Double>> getTotalAmountByStatusAndTier() {
        Map<String, Map<String, Double>> amounts = new HashMap<>();
        
        postPaymentRepository.findDistinctStatuses().forEach(status -> {
            Map<String, Double> tierAmounts = new HashMap<>();
            for (PostTier postTier : PostTier.values()) {
                Double amount = postPaymentRepository.sumAmountByStatusAndPostTier(status, postTier);
                tierAmounts.put(postTier.name(), amount != null ? amount : 0.0);
            }
            amounts.put(status, tierAmounts);
        });
        
        return amounts;
    }

    /**
     * Calculate average remaining quotas by type
     */
    public Map<String, Double> getAverageQuotaRemaining() {
        Map<String, Double> averages = new HashMap<>();
        averages.put("VipGold", userPostQuotaRepository.findAverageVipGoldRemaining());
        averages.put("VipSilver", userPostQuotaRepository.findAverageVipSilverRemaining());
        averages.put("Regular", userPostQuotaRepository.findAverageRegularRemaining());
        return averages;
    }

    /**
     * Count quotas that are expired or expiring soon
     */
    public Map<String, Long> getQuotaExpirationStats(LocalDateTime threshold) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("Expired", userPostQuotaRepository.countExpiredQuotas(LocalDateTime.now()));
        stats.put("ExpiringSoon", userPostQuotaRepository.countQuotasExpiringSoon(LocalDateTime.now(), threshold));
        stats.put("AllZeroQuotas", userPostQuotaRepository.countAllZeroQuotas());
        return stats;
    }

    /**
     * Count the number of packets sold by packet name
     */
    public Map<String, Long> getPacketSalesCount() {
        Map<String, Long> salesCount = new HashMap<>();
        List<Object[]> results = userPostQuotaRepository.countByPacketName();
        for (Object[] result : results) {
            String packetName = (String) result[0];
            Long count = (Long) result[1];
            if (packetName != null) {
                salesCount.put(packetName, count);
            }
        }
        return salesCount;
    }

    /**
     * Calculate total revenue by packet name
     */
    public Map<String, Double> getPacketRevenue() {
        Map<String, Double> revenue = new HashMap<>();
        List<Object[]> results = userPostQuotaRepository.sumAmountPaidByPacketName();
        for (Object[] result : results) {
            String packetName = (String) result[0];
            Double amount = (Double) result[1];
            if (packetName != null) {
                revenue.put(packetName, amount != null ? amount : 0.0);
            }
        }
        return revenue;
    }

    /**
     * Get comprehensive payment and quota statistics
     */
    public ApiResponse<Map<String, Object>> getComprehensivePaymentStatistics(LocalDateTime expirationThreshold) {
        try {
            if (expirationThreshold != null && expirationThreshold.isBefore(LocalDateTime.now())) {
                return new ApiResponse<>(false, "Invalid expiration threshold date", null, "Threshold date must be in the future");
            }

            Map<String, Object> comprehensiveStats = new HashMap<>();
            comprehensiveStats.put("paymentCountsByTypeAndTier", getPaymentCountsByTypeAndTier());
            comprehensiveStats.put("totalAmountByStatusAndTier", getTotalAmountByStatusAndTier());
            comprehensiveStats.put("averageQuotaRemaining", getAverageQuotaRemaining());
            comprehensiveStats.put("quotaExpirationStats", getQuotaExpirationStats(expirationThreshold));
            comprehensiveStats.put("packetSalesCount", getPacketSalesCount());
            comprehensiveStats.put("packetRevenue", getPacketRevenue());

            return new ApiResponse<>(true, "Payment and quota statistics retrieved successfully", comprehensiveStats, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to retrieve statistics", null, e.getMessage());
        }
    }
}