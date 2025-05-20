package com.realestatemarket.authenticationservice.service;

import com.realestatemarket.authenticationservice.enums.Role;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.realestatemarket.authenticationservice.dao.UserRepository;
import com.realestatemarket.authenticationservice.response.ApiResponse;

@Service
@RequiredArgsConstructor
public class UserStatisticsService {

    private final UserRepository userRepository;

    /**
     * Count users by role
     */
    public Map<String, Long> getUserCountsByRole() {
        Map<String, Long> counts = new HashMap<>();
        for (Role role : Role.values()) {
            counts.put(role.name(), userRepository.countByRole(role));
        }
        return counts;
    }

    /**
     * Count users by status (active/inactive)
     */
    public Map<String, Long> getUserCountsByStatus() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("Active", userRepository.countByStatus(false));
        counts.put("Inactive", userRepository.countByStatus(true));
        return counts;
    }

    /**
     * Count users by user tier (including null tier)
     */
    // public Map<String, Long> getUserCountsByTier() {
    //     Map<String, Long> counts = new HashMap<>();
    //     counts.put("NoTier", userRepository.countByUserTierIsNull());
    //     userRepository.findDistinctTiers().forEach(tier -> {
    //         if (tier != null) {
    //             counts.put(tier.toString(), userRepository.countByUserTier(tier));
    //         }
    //     });
    //     return counts;
    // }

    /**
     * Calculate total and average account balance
     */
    public Map<String, Double> getAccountBalanceStats() {
        Map<String, Double> stats = new HashMap<>();
        Double total = userRepository.sumAccountBalance();
        Double average = userRepository.avgAccountBalance();
        stats.put("TotalBalance", total != null ? total : 0.0);
        stats.put("AverageBalance", average != null ? average : 0.0);
        return stats;
    }

    /**
     * Count users registered within a time period (or all time if start/end are null)
     */
    public Map<String, Long> getUserRegistrationsByTimePeriod(LocalDateTime start, LocalDateTime end) {
        Map<String, Long> stats = new HashMap<>();
        if (start == null || end == null) {
            stats.put("TotalUsers", userRepository.count());
            for (Role role : Role.values()) {
                stats.put(role.name() + "Users", userRepository.countByRole(role));
            }
        } else {
            stats.put("TotalUsers", userRepository.countInPeriod(start, end));
            for (Role role : Role.values()) {
                stats.put(role.name() + "Users", userRepository.countInPeriodByRole(start, end, role));
            }
        }
        return stats;
    }

    /**
     * Get comprehensive user statistics
     */
    public ApiResponse<Map<String, Object>> getComprehensiveUserStatistics(LocalDateTime start, LocalDateTime end) {
        try {
            if (start != null && end != null && start.isAfter(end)) {
                return new ApiResponse<>(false, "Invalid date range", null, "Start date must be before end date");
            }

            Map<String, Object> comprehensiveStats = new HashMap<>();
            comprehensiveStats.put("userCountsByRole", getUserCountsByRole());
            comprehensiveStats.put("userCountsByStatus", getUserCountsByStatus());
            // comprehensiveStats.put("userCountsByTier", getUserCountsByTier());
            comprehensiveStats.put("accountBalanceStats", getAccountBalanceStats());
            comprehensiveStats.put("userRegistrationsByTimePeriod", getUserRegistrationsByTimePeriod(start, end));

            return new ApiResponse<>(true, "User statistics retrieved successfully", comprehensiveStats, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to retrieve statistics", null, e.getMessage());
        }
    }
}