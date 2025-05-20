package com.realestatemarket.authenticationservice.rest;


import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

import com.realestatemarket.authenticationservice.response.ApiResponse;
import com.realestatemarket.authenticationservice.service.OverviewStatisticsService;

@RestController
@RequestMapping("/api/v1/overview-statistics")
@RequiredArgsConstructor
public class OverviewStatisticsController{

    private final OverviewStatisticsService overviewStatisticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverviewStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime expirationThreshold) {
        ApiResponse<Map<String, Object>> response = overviewStatisticsService.getOverviewStatistics(start, end, expirationThreshold);
        return ResponseEntity.ok(response);
    }
}