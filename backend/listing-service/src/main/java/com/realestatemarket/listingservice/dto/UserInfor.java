package com.realestatemarket.listingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserInfor {
    private UUID id;
    private String email;
    private String phone;
    private String fullName;
    private double balance;
    private boolean inActive;
}
