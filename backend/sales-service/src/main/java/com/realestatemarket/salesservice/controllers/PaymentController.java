package com.realestatemarket.salesservice.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.realestatemarket.salesservice.entity.WalletTopup;
import com.realestatemarket.salesservice.response.ApiResponse;
import com.realestatemarket.salesservice.services.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ApiResponse<String> createPaymentUrl(
            @RequestParam long amount,
            @RequestHeader(value = "X-User-Id", required = false) String userInfor,
            HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();    
        return paymentService.createPaymentUrl(amount, ipAddress, userInfor);
    }

    @GetMapping("/return")
    public ApiResponse<Map<String, String>> processReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        return paymentService.handleReturn(params, response);
    }

    @PostMapping("/ipn")
    public ApiResponse<String> processIPN(@RequestParam Map<String, String> params) {
        return paymentService.handleIPN(params);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WalletTopup>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.getTransactionById(id));
    }

    @GetMapping("/phone")
    public ResponseEntity<ApiResponse<List<WalletTopup>>> getByPhone(@RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        return ResponseEntity.ok(paymentService.getTransactionsByPhone(userInfor));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<WalletTopup>>> getAll() {
        return ResponseEntity.ok(paymentService.getAllTransactions());
    }
}
