package com.realestatemarket.paymentservice.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor  
public class PostPaymentRequest {  
    private UUID postId;
    private String postTier;
    private String paymentType;
    private double amount;
    private UUID quotaId;  
}
