package com.realestatemarket.paymentservice.controller;

import java.util.List;

import com.realestatemarket.paymentservice.entity.UserPostQuota;
import com.realestatemarket.paymentservice.response.ApiResponse;
import com.realestatemarket.paymentservice.service.UserPostQuotaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatemarket.paymentservice.request.UserPostQuotaRequest;

@RestController
@RequestMapping("/api/v1/user-post-quotas")
public class UserPostQuotaController {

    private final UserPostQuotaService userPostQuotaService;

    public UserPostQuotaController(UserPostQuotaService userPostQuotaService) {
        this.userPostQuotaService = userPostQuotaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserPostQuota>>> getUserPostQuota(@RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        // userInfor = "0123456789";
        if (userInfor == null || userInfor.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "User ID is required", null, "BadRequest"));
        }

        // Lấy thông tin từ service
        ApiResponse<List<UserPostQuota>> response = userPostQuotaService.getUserPostQuota(userInfor);

        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserPostQuota>>> getAllUserPostQuota() {
        ApiResponse<List<UserPostQuota>> response = userPostQuotaService.getAllUserPostQuota();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/valid")
    public ResponseEntity<ApiResponse<List<UserPostQuota>>> getUserPostQuotaValid(@RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        // userInfor = "0123456789";
        if (userInfor == null || userInfor.isEmpty()) {
            return ResponseEntity.status(200).body(new ApiResponse<>(false, "User ID is required", null, "BadRequest"));
        }

        // Lấy thông tin từ service
        ApiResponse<List<UserPostQuota>> response = userPostQuotaService.getUserPostQuotaValidate(userInfor);
        return ResponseEntity.status(200).body(response);
    }


    @PostMapping
    public ResponseEntity<ApiResponse<UserPostQuota>> createOrUpdateUserPostQuota(
                    @RequestHeader(value = "X-User-Id", required = false) String userInfor,    
                    @RequestBody UserPostQuotaRequest userPostQuota) {
        
        // userInfor = "0123456789";
        if (userInfor == null) {
            return ResponseEntity.status(200).body(new ApiResponse<>(false, "User ID is required", null, "BadRequest"));
        }
        ApiResponse<UserPostQuota> response = userPostQuotaService.createOrUpdateUserPostQuota(userPostQuota, userInfor);
        return ResponseEntity.ok(response);
    }
}
