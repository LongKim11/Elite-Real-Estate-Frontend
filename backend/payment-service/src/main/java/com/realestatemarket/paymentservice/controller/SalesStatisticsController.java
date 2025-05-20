package com.realestatemarket.paymentservice.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

import com.realestatemarket.paymentservice.response.ApiResponse;
import com.realestatemarket.paymentservice.service.SalesStatisticsService;

@RestController
@RequestMapping("/api/v1/sales-statistics")
@RequiredArgsConstructor
public class SalesStatisticsController {

    private final SalesStatisticsService salesStatisticsService;

    /**
     * Lấy thống kê toàn diện về thanh toán và hạn mức
     * @param expirationThreshold Ngày ngưỡng để kiểm tra hạn mức sắp hết hạn (tùy chọn)
     * @return ApiResponse chứa dữ liệu thống kê hoặc thông báo lỗi
     */
    @GetMapping("/comprehensive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime expirationThreshold) {
        ApiResponse<Map<String, Object>> response = salesStatisticsService.getComprehensivePaymentStatistics(expirationThreshold);
        return ResponseEntity.ok(response);
    }
}