package com.realestatemarket.paymentservice.enums;

public enum PostTier  {
    VIP_GOLD,    
    VIP_SILVER,  
    REGULAR;
    public static PostTier fromString(String tier) {
        if (tier != null) {
            for (PostTier postTier : PostTier.values()) {
                if (tier.equalsIgnoreCase(postTier.name())) {
                    return postTier;
                }
            }
        }
        throw new IllegalArgumentException("No enum constant for value: " + tier);
    }
}