package com.realestatemarket.rentalservice.controllers;


import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.realestatemarket.rentalservice.response.ApiResponse;
import com.realestatemarket.rentalservice.services.ViewingStatisticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/viewing-statistics")
@RequiredArgsConstructor
public class ViewingStatisticsController {

    private final ViewingStatisticsService viewingStatisticsService;

    @GetMapping("/comprehensive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        ApiResponse<Map<String, Object>> response = viewingStatisticsService.getComprehensiveViewingStatistics(start, end);
        return ResponseEntity.ok(response);
    }
}