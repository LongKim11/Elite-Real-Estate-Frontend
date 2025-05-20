package com.realestatemarket.rentalservice.services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.realestatemarket.rentalservice.enums.ViewingStatus;
import com.realestatemarket.rentalservice.repository.ViewingRepository;
import com.realestatemarket.rentalservice.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewingStatisticsService {

    private final ViewingRepository viewingRepository;

    /**
     * Count viewings by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
     */
    public Map<String, Long> getViewingCountsByStatus() {
        Map<String, Long> counts = new HashMap<>();
        for (ViewingStatus status : ViewingStatus.values()) {
            counts.put(status.name(), viewingRepository.countByStatus(status));
        }
        return counts;
    }

    /**
     * Count viewings by property ID to identify popular properties
     */
    public Map<String, Long> getViewingCountsByProperty() {
        Map<String, Long> counts = new HashMap<>();
        List<Object[]> results = viewingRepository.countByPropertyId();
        for (Object[] result : results) {
            UUID propertyId = (UUID) result[0];
            Long count = (Long) result[1];
            counts.put(propertyId.toString(), count);
        }
        return counts;
    }

    /**
     * Count unique viewers based on viewerEmail or viewerPhone
     */
    public Map<String, Long> getUniqueViewerCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("ByEmail", viewingRepository.countUniqueViewersByEmail());
        counts.put("ByPhone", viewingRepository.countUniqueViewersByPhone());
        return counts;
    }

    /**
     * Count viewings within a time period (or all time if start/end are null)
     */
    public Map<String, Long> getViewingsByTimePeriod(LocalDateTime start, LocalDateTime end) {
        Map<String, Long> stats = new HashMap<>();
        if (start == null || end == null) {
            // No time filter: count all viewings
            stats.put("TotalViewings", viewingRepository.count());
            for (ViewingStatus status : ViewingStatus.values()) {
                stats.put(status.name() + "Viewings", viewingRepository.countByStatus(status));
            }
        } else {
            // Time-filtered viewings
            stats.put("TotalViewings", viewingRepository.countInPeriod(start, end));
            for (ViewingStatus status : ViewingStatus.values()) {
                stats.put(status.name() + "Viewings", viewingRepository.countInPeriodByStatus(start, end, status));
            }
        }
        return stats;
    }

    /**
     * Get comprehensive viewing statistics
     */
    public ApiResponse<Map<String, Object>> getComprehensiveViewingStatistics(LocalDateTime start, LocalDateTime end) {
        try {
            if (start != null && end != null && start.isAfter(end)) {
                return new ApiResponse<>(false, "Invalid date range", null, "Start date must be before end date");
            }

            Map<String, Object> comprehensiveStats = new HashMap<>();
            comprehensiveStats.put("viewingCountsByStatus", getViewingCountsByStatus());
            comprehensiveStats.put("viewingCountsByProperty", getViewingCountsByProperty());
            comprehensiveStats.put("uniqueViewerCounts", getUniqueViewerCounts());
            comprehensiveStats.put("viewingsByTimePeriod", getViewingsByTimePeriod(start, end));

            return new ApiResponse<>(true, "Viewing statistics retrieved successfully", comprehensiveStats, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to retrieve statistics", null, e.getMessage());
        }
    }
}