package com.realestatemarket.paymentservice.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.realestatemarket.paymentservice.enums.PostTier;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_post_quotas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPostQuota {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "vip_gold_remaining", nullable = false)
    private Integer vipGoldRemaining;

    @Column(name = "vip_silver_remaining", nullable = false)
    private Integer vipSilverRemaining;

    @Column(name = "regular_remaining", nullable = false)
    private Integer regularRemaining;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt; 

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "amount_paid", nullable = false)
    private Double amountPaid; 

    @Column(name="packet_name")
    private String packetName;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        
        // Initialize remaining quotas
        if (this.vipGoldRemaining == null) this.vipGoldRemaining = 0;
        if (this.vipSilverRemaining == null) this.vipSilverRemaining = 0;
        if (this.regularRemaining == null) this.regularRemaining = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to update user post quota
    public void updateQuota(PostTier tier, int quantity, boolean isAdding) {
        if (isAdding) {
            switch (tier) {
                case VIP_GOLD:
                    this.vipGoldRemaining += quantity;
                    break;
                case VIP_SILVER:
                    this.vipSilverRemaining += quantity;
                    break;
                case REGULAR:
                    this.regularRemaining += quantity;
                    break;
            }
        } else {
            switch (tier) {
                case VIP_GOLD:
                    this.vipGoldRemaining = Math.max(0, this.vipGoldRemaining - quantity);
                    break;
                case VIP_SILVER:
                    this.vipSilverRemaining = Math.max(0, this.vipSilverRemaining - quantity);
                    break;
                case REGULAR:
                    this.regularRemaining = Math.max(0, this.regularRemaining - quantity);
                    break;
            }
        }
    }

    // Helper method to check if user has enough quota
    // public boolean hasEnoughQuota() {
    //     if (this.vipGoldRemaining > 0 && this.vipSilverRemaining > 0 && this.regularRemaining > 0) 
    //         return false;
    //     this.setExpiredAt(LocalDateTime.now());
    //     return true;
    // }
}
