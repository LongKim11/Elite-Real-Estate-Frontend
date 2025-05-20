package com.realestatemarket.salesservice.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTopupResponse {
    private UUID walletTopupsId;
    private String phoneNumber;
    private double amount;
    private LocalDateTime createdTime;
    private boolean status;
}
