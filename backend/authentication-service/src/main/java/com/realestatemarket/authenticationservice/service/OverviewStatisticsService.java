package com.realestatemarket.authenticationservice.service;

import com.realestatemarket.authenticationservice.response.ApiResponse;
import com.realestatemarket.authenticationservice.service.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OverviewStatisticsService {

    private final UserStatisticsService userStatisticsService;
    private final RestTemplate restTemplate;

    /**
     * Get comprehensive overview statistics from all services
     */
    public ApiResponse<Map<String, Object>> getOverviewStatistics(
            LocalDateTime start, LocalDateTime end, LocalDateTime expirationThreshold) {
        try {
            // Validate date ranges
            if (start != null && end != null && start.isAfter(end)) {
                return new ApiResponse<>(false, "Invalid date range", null, "Start date must be before end date");
            }
            if (expirationThreshold != null && expirationThreshold.isBefore(LocalDateTime.now())) {
                return new ApiResponse<>(false, "Invalid expiration threshold", null, "Threshold date must be in the future");
            }

            Map<String, Object> overviewStats = new HashMap<>();

            // Fetch user statistics (local service)
            ApiResponse<Map<String, Object>> userStatsResponse = userStatisticsService.getComprehensiveUserStatistics(start, end);
            Map<String, Object> userStats = userStatsResponse.isSuccess() ? userStatsResponse.getData() : new HashMap<>();
            overviewStats.put("userStatistics", userStats);

            // Fetch payment statistics (external service)
            String listingUrl = "http://real-estate-listing:8101/api/v1/listings-statistics/comprehensive" +
                    (expirationThreshold != null ? "?expirationThreshold=" + expirationThreshold.toString() : "");
            Map<String, Object> listingStats = fetchExternalStats(listingUrl, "payment statistics");
            overviewStats.put("listingStatistics", listingStats);

            // Fetch payment statistics (external service)
            String paymentUrl = "http://real-estate-sales:8103/api/v1/sales-statistics/comprehensive" +
                    (expirationThreshold != null ? "?expirationThreshold=" + expirationThreshold.toString() : "");
            Map<String, Object> paymentStats = fetchExternalStats(paymentUrl, "payment statistics");
            overviewStats.put("salesStatistics", paymentStats);

            // Fetch wallet top-up statistics (external service)
            String walletUrl = "http://real-estate-payment:8102/api/v1/wallet-statistics/comprehensive" +
                    (start != null && end != null ? "?start=" + start.toString() + "&end=" + end.toString() : "");
            Map<String, Object> walletStats = fetchExternalStats(walletUrl, "wallet top-up statistics");
            overviewStats.put("walletTopupStatistics", walletStats);

            // Fetch viewing statistics (external service)
            String viewingUrl = "http://real-estate-rental:8104/api/v1/viewing-statistics/comprehensive" +
                    (start != null && end != null ? "?start=" + start.toString() + "&end=" + end.toString() : "");
            Map<String, Object> viewingStats = fetchExternalStats(viewingUrl, "viewing statistics");
            overviewStats.put("viewingStatistics", viewingStats);

            return new ApiResponse<>(true, "Overview statistics retrieved successfully", overviewStats, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to retrieve overview statistics", null, e.getMessage());
        }
    }

    /**
     * Helper method to fetch statistics from external services
     */
    private Map<String, Object> fetchExternalStats(String url, String serviceName) {
        try {
            ResponseEntity<ApiResponse<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
            );

            ApiResponse<Map<String, Object>> apiResponse = response.getBody();
            if (apiResponse != null && apiResponse.isSuccess()) {
                return apiResponse.getData();
            } else {
                System.err.println("Failed to fetch " + serviceName + ": " + (apiResponse != null ? apiResponse.getError() : "No response"));
                return new HashMap<>();
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch " + serviceName + ": " + e.getMessage());
            return new HashMap<>();
        }
    }
}