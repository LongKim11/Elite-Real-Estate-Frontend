package com.realestatemarket.authenticationservice.rest;

import com.realestatemarket.authenticationservice.entity.User;
import com.realestatemarket.authenticationservice.entity.UserTier;
import com.realestatemarket.authenticationservice.dao.UserRepository;
import com.realestatemarket.authenticationservice.response.ApiResponse;
import com.realestatemarket.authenticationservice.service.UserTierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tiers")
@RequiredArgsConstructor
public class UserTierController {

    private final UserTierService userTierService;
    private final UserRepository userRepository;

    @PostMapping("/seed")
    public ApiResponse<String> seedTiers() {
        return userTierService.seedDefaultTiers();
    }

    @GetMapping
    public ApiResponse<List<UserTier>> getAllTiers() {
        return userTierService.getAllTiers();
    }

    @PostMapping("/assign/{tierId}/user/{userId}")
    public ApiResponse<UserTier> assignTier(@PathVariable Long tierId, @PathVariable UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userTierService.assignTierToUser(tierId, user);
    }
}
