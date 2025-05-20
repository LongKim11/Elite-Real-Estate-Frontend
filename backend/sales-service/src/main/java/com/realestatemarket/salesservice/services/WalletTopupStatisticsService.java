package com.realestatemarket.salesservice.services;

import com.realestatemarket.salesservice.repository.WalletTopupRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.realestatemarket.salesservice.response.ApiResponse;

@Service
@RequiredArgsConstructor
public class WalletTopupStatisticsService {

    private final WalletTopupRepository walletTopupRepository;

    /**
     * Count top-ups by status (true for success, false for failure)
     */
    public Map<String, Long> getTopupCountsByStatus() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("Success", walletTopupRepository.countByStatus(true));
        counts.put("Failure", walletTopupRepository.countByStatus(false));
        return counts;
    }

    /**
     * Calculate total and average top-up amounts by status
     */
    public Map<String, Map<String, Double>> getTopupAmountsByStatus() {
        Map<String, Map<String, Double>> amounts = new HashMap<>();
        
        for (boolean status : new boolean[]{true, false}) {
            Map<String, Double> metrics = new HashMap<>();
            Double total = walletTopupRepository.sumAmountByStatus(status);
            Double average = walletTopupRepository.avgAmountByStatus(status);
            metrics.put("Total", total != null ? total : 0.0);
            metrics.put("Average", average != null ? average : 0.0);
            amounts.put(status ? "Success" : "Failure", metrics);
        }
        
        return amounts;
    }

    /**
     * Count top-ups by phone number to identify frequent users
     */
    public Map<String, Long> getTopupCountsByPhoneNumber() {
        Map<String, Long> counts = new HashMap<>();
        List<Object[]> results = walletTopupRepository.countByPhoneNumber();
        for (Object[] result : results) {
            String phoneNumber = (String) result[0];
            Long count = (Long) result[1];
            counts.put(phoneNumber, count);
        }
        return counts;
    }

    /**
     * Calculate total top-up amounts over a time period
     */
    public Map<String, Double> getTopupAmountsByTimePeriod(LocalDateTime start, LocalDateTime end) {
        Map<String, Double> stats = new HashMap<>();
        if (start != null && end != null && !start.isAfter(end)) {
            Double total = walletTopupRepository.sumAmountInPeriod(start, end);
            Double successTotal = walletTopupRepository.sumAmountInPeriodByStatus(start, end, true);
            Double failureTotal = walletTopupRepository.sumAmountInPeriodByStatus(start, end, false);
            stats.put("Total", total != null ? total : 0.0);
            stats.put("SuccessTotal", successTotal != null ? successTotal : 0.0);
            stats.put("FailureTotal", failureTotal != null ? failureTotal : 0.0);
        } else {
            // If no time filter or invalid range, return all-time stats
            Double total = walletTopupRepository.sumAmount();
            Double successTotal = walletTopupRepository.sumAmountByStatus(true);
            Double failureTotal = walletTopupRepository.sumAmountByStatus(false);
            stats.put("Total", total != null ? total : 0.0);
            stats.put("SuccessTotal", successTotal != null ? successTotal : 0.0);
            stats.put("FailureTotal", failureTotal != null ? failureTotal : 0.0);
        }
        return stats;
    }

    /**
     * Get comprehensive top-up statistics
     */
    public ApiResponse<Map<String, Object>> getComprehensiveTopupStatistics(LocalDateTime start, LocalDateTime end) {
        try {
            if (start != null && end != null && start.isAfter(end)) {
                return new ApiResponse<>(false, "Invalid date range", null, "Start date must be before end date");
            }

            Map<String, Object> comprehensiveStats = new HashMap<>();
            comprehensiveStats.put("topupCountsByStatus", getTopupCountsByStatus());
            comprehensiveStats.put("topupAmountsByStatus", getTopupAmountsByStatus());
            comprehensiveStats.put("topupCountsByPhoneNumber", getTopupCountsByPhoneNumber());
            comprehensiveStats.put("topupAmountsByTimePeriod", getTopupAmountsByTimePeriod(start, end));

            return new ApiResponse<>(true, "Wallet top-up statistics retrieved successfully", comprehensiveStats, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to retrieve statistics", null, e.getMessage());
        }
    }
}