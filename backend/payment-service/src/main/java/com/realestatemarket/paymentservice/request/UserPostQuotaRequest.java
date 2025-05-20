package com.realestatemarket.paymentservice.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserPostQuotaRequest {
    private String packetName;
    private double amount;
}