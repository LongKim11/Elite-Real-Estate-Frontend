package com.realestatemarket.listingservice.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

import com.realestatemarket.listingservice.response.ApiResponse;
import com.realestatemarket.listingservice.services.PropertyStatisticsService;

@RestController
@RequestMapping("/api/v1/listings-statistics")
@RequiredArgsConstructor
public class PropertyStatisticsController {

    private final PropertyStatisticsService propertyStatisticsService;

    @GetMapping("/comprehensive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        ApiResponse<Map<String, Object>> response = propertyStatisticsService.getComprehensiveStatistics(start, end);
        return ResponseEntity.ok(response);
    }
}