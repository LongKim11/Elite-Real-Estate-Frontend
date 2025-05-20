package com.realestatemarket.paymentservice.controller;

import com.realestatemarket.paymentservice.entity.PostPayment;
import com.realestatemarket.paymentservice.response.ApiResponse;
import com.realestatemarket.paymentservice.service.PostPaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import com.realestatemarket.paymentservice.request.PostPaymentRequest;

@RestController
@RequestMapping("/api/v1/post-payments")
public class PostPaymentController {

    private final PostPaymentService postPaymentService;

    @Autowired
    public PostPaymentController(PostPaymentService postPaymentService) {
        this.postPaymentService = postPaymentService;
    }

    
    // Handle post payment and update user quota accordingly.
    @PostMapping("/handle")
    public ResponseEntity<ApiResponse<PostPayment>> handlePostPayment(
                                        @RequestHeader(value = "X-User-Id", required = false) String userInfor,     
                                        @RequestBody PostPaymentRequest postPayment) {
        // userInfor = "0123456789";
        if (userInfor == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "User ID is required", null, "BadRequest"));
        }
        ApiResponse<PostPayment> response = postPaymentService.handlePostPayment(postPayment, userInfor);
        return ResponseEntity.ok(response);
    }

    // Get PostPayment by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostPayment>> getPostPaymentById(@PathVariable UUID id) {
        ApiResponse<PostPayment> response = postPaymentService.getPostPaymentById(id);
        return ResponseEntity.ok(response);
    }

    // Get all PostPayments
    @GetMapping
    public ResponseEntity<ApiResponse<List<PostPayment>>> getAllPostPayments() {
        ApiResponse<List<PostPayment>> response = postPaymentService.getAllPostPayments();
        return ResponseEntity.ok(response);
    }

    // Get PostPayments by userId
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<PostPayment>>> getPostPaymentsByUserId(
                @RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        // userInfor = "0123456789";
        if (userInfor == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "User ID is required", null, "BadRequest"));
        }
        ApiResponse<List<PostPayment>> response = postPaymentService.getPostPaymentsByUserId(userInfor);
        return ResponseEntity.ok(response);
    }
}
