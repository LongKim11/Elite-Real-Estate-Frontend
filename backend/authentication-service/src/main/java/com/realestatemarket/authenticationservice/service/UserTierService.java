package com.realestatemarket.authenticationservice.service;

import com.realestatemarket.authenticationservice.entity.User;
import com.realestatemarket.authenticationservice.entity.UserTier;
import com.realestatemarket.authenticationservice.dao.UserRepository;
import com.realestatemarket.authenticationservice.repository.UserTierRepository;
import com.realestatemarket.authenticationservice.response.ApiResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserTierService {

    private final UserTierRepository userTierRepository;
    private final UserRepository userRepository;

    public ApiResponse<String> seedDefaultTiers() {
        if (userTierRepository.count() > 0) {
            return new ApiResponse<>(true, "Tiers already exist", null, null);
        }

        UserTier noTier = UserTier.builder()
                .name("No Tier")
                .vipGoldCount(0)
                .vipSilverCount(0)
                .regularCount(0)
                .pushCount(0)
                .fastPublish(false)
                .imageCopyright(false)
                .schedulePost(false)
                .performanceReport(false)
                .bulkOperation(false)
                .isDefault(true)
                .build();

        UserTier basic = UserTier.builder()
                .name("Basic")
                .vipGoldCount(0)
                .vipSilverCount(0)
                .regularCount(15)
                .pushCount(15)
                .fastPublish(true)
                .imageCopyright(true)
                .schedulePost(true)
                .performanceReport(true)
                .bulkOperation(false)
                .isDefault(false)
                .build();

        UserTier standard = UserTier.builder()
                .name("Standard")
                .vipGoldCount(0)
                .vipSilverCount(1)
                .regularCount(30)
                .pushCount(30)
                .fastPublish(true)
                .imageCopyright(true)
                .schedulePost(true)
                .performanceReport(true)
                .bulkOperation(true)
                .isDefault(false)
                .build();

        UserTier premium = UserTier.builder()
                .name("Premium")
                .vipGoldCount(1)
                .vipSilverCount(2)
                .regularCount(50)
                .pushCount(50)
                .fastPublish(true)
                .imageCopyright(true)
                .schedulePost(true)
                .performanceReport(true)
                .bulkOperation(true)
                .isDefault(false)
                .build();

        userTierRepository.saveAll(Arrays.asList(noTier, basic, standard, premium));

        return new ApiResponse<>(true, "Default tiers seeded successfully", null, null);
    }

    public ApiResponse<List<UserTier>> getAllTiers() {
        List<UserTier> tiers = userTierRepository.findAll();
        return new ApiResponse<>(true, "Fetched all tiers", tiers, null);
    }

    @Transactional
    public ApiResponse<UserTier> assignTierToUser(Long tierId, User user) {
        UserTier tier = userTierRepository.findById(tierId)
                .orElseThrow(() -> new RuntimeException("Tier not found"));

        user.setUserTier(tier);
        userRepository.save(user);

        return new ApiResponse<>(true, "Tier assigned to user successfully", tier, null);
    }
}
