package com.realestatemarket.listingservice.services;

import com.realestatemarket.listingservice.entity.Apartment;
import com.realestatemarket.listingservice.entity.House;
import com.realestatemarket.listingservice.entity.Land;
import com.realestatemarket.listingservice.repository.PropertyRepository;
import com.realestatemarket.listingservice.repository.ViewingRepository;
import com.realestatemarket.listingservice.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PropertyStatisticsService {

    private final PropertyRepository propertyRepository;
    private final ViewingRepository viewingRepository;

    /**
     * Get count of properties by type (Apartment, House, Land)
     */
    public Map<String, Long> getPropertyTypeCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("Apartment", propertyRepository.countByType(Apartment.class));
        counts.put("House", propertyRepository.countByType(House.class));
        counts.put("Land", propertyRepository.countByType(Land.class));
        return counts;
    }

    /**
     * Calculate average price by property type
     */
    public Map<String, Double> getAveragePriceByType() {
        Map<String, Double> averages = new HashMap<>();
        averages.put("Apartment", propertyRepository.findAveragePriceByType(Apartment.class));
        averages.put("House", propertyRepository.findAveragePriceByType(House.class));
        averages.put("Land", propertyRepository.findAveragePriceByType(Land.class));
        return averages;
    }

    /**
     * Count viewings per property type
     */
    public Map<String, Long> getViewingsByPropertyType() {
        Map<String, Long> viewings = new HashMap<>();
        viewings.put("Apartment", viewingRepository.countViewingsByPropertyType(Apartment.class));
        viewings.put("House", viewingRepository.countViewingsByPropertyType(House.class));
        viewings.put("Land", viewingRepository.countViewingsByPropertyType(Land.class));
        return viewings;
    }

    /**
     * Get property distribution by category and transaction type
     */
    public Map<String, Map<String, Long>> getPropertyDistribution() {
        Map<String, Map<String, Long>> distribution = new HashMap<>();
        
        propertyRepository.findDistinctCategories().forEach(category -> {
            Map<String, Long> transactionCounts = new HashMap<>();
            propertyRepository.findDistinctTransactionTypes().forEach(transactionType -> {
                Long count = propertyRepository.countByCategoryAndTypeTransaction(category, transactionType);
                transactionCounts.put(transactionType, count);
            });
            distribution.put(category, transactionCounts);
        });
        
        return distribution;
    }

    /**
     * Get viewing statistics by time period (or all time if start/end are null)
     */
    public Map<String, Long> getViewingsByTimePeriod(LocalDateTime start, LocalDateTime end) {
        Map<String, Long> stats = new HashMap<>();
        
        if (start == null || end == null) {
            // No time filter: get all viewings
            // stats.put("TotalViewings", viewingRepository.count());
            // stats.put("UniqueViewers", viewingRepository.countUniqueViewers());
            stats.put("ApartmentViewings", viewingRepository.countViewingsByPropertyType(Apartment.class));
            stats.put("HouseViewings", viewingRepository.countViewingsByPropertyType(House.class));
            stats.put("LandViewings", viewingRepository.countViewingsByPropertyType(Land.class));
        } else {
            // Time-filtered viewings
            // stats.put("TotalViewings", viewingRepository.countViewingsInPeriod(start, end));
            // stats.put("UniqueViewers", viewingRepository.countUniqueViewersInPeriod(start, end));
            stats.put("ApartmentViewings", viewingRepository.countViewingsByPropertyTypeInPeriod(Apartment.class, start, end));
            stats.put("HouseViewings", viewingRepository.countViewingsByPropertyTypeInPeriod(House.class, start, end));
            stats.put("LandViewings", viewingRepository.countViewingsByPropertyTypeInPeriod(Land.class, start, end));
        }
        
        return stats;
    }

    /**
     * Get comprehensive statistics combining all metrics
     */
    public ApiResponse<Map<String, Object>> getComprehensiveStatistics(LocalDateTime start, LocalDateTime end) {
        try {
            if (start != null && end != null && start.isAfter(end)) {
                return new ApiResponse<>(false, "Invalid date range", null, "Start date must be before end date");
            }

            Map<String, Object> comprehensiveStats = new HashMap<>();
            comprehensiveStats.put("propertyTypeCounts", getPropertyTypeCounts());
            comprehensiveStats.put("averagePrices", getAveragePriceByType());
            // comprehensiveStats.put("viewingsByType", getViewingsByPropertyType());
            comprehensiveStats.put("propertyDistribution", getPropertyDistribution());
            // comprehensiveStats.put("viewingStats", getViewingsByTimePeriod(start, end));

            return new ApiResponse<>(true, "Statistics retrieved successfully", comprehensiveStats, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to retrieve statistics", null, e.getMessage());
        }
    }
}