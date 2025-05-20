package com.realestatemarket.authenticationservice.rest;

import com.realestatemarket.authenticationservice.service.UserStatisticsService;

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

@RestController
@RequestMapping("/api/v1/user-statistics")
@RequiredArgsConstructor
public class UserStatisticsController {

    private final UserStatisticsService userStatisticsService;

    @GetMapping("/comprehensive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        ApiResponse<Map<String, Object>> response = userStatisticsService.getComprehensiveUserStatistics(start, end);
        return ResponseEntity.ok(response);
    }
}