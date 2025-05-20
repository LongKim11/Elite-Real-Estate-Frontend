package com.realestatemarket.paymentservice.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.realestatemarket.paymentservice.enums.PaymentType;
import com.realestatemarket.paymentservice.enums.PostTier;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "post_payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "post_id")
    private UUID postId;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_tier", nullable = false)
    private PostTier postTier;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "status", nullable = false)
    private String status = "SUCCESS";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.expiredAt = LocalDateTime.now();
    }

    // Helper method to update user post quota upon successful payment
    public boolean updateUserPostQuota(UserPostQuota quota) {
        if ("SUCCESS".equals(this.status)) {
            quota.updateQuota(this.postTier, 1, false); 
        }
        if(quota.getVipGoldRemaining() == 0 && quota.getVipSilverRemaining() == 0 && quota.getRegularRemaining() == 0) {
            return true;
        }
        return false;
    }

    // Helper method to add quota if payment is successful
    public void addUserPostQuota(UserPostQuota quota) {
        if ("SUCCESS".equals(this.status)) {
            quota.updateQuota(this.postTier, 1, true); 
        }
    }
}
