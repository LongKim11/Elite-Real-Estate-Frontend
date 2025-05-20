package com.realestatemarket.salesservice.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

import com.realestatemarket.salesservice.response.ApiResponse;
import com.realestatemarket.salesservice.services.WalletTopupStatisticsService;

@RestController
@RequestMapping("/api/v1/wallet-statistics")
@RequiredArgsConstructor
public class WalletTopupStatisticsController {

    private final WalletTopupStatisticsService walletTopupStatisticsService;

    @GetMapping("/comprehensive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        ApiResponse<Map<String, Object>> response = walletTopupStatisticsService.getComprehensiveTopupStatistics(start, end);
        return ResponseEntity.ok(response);
    }
}