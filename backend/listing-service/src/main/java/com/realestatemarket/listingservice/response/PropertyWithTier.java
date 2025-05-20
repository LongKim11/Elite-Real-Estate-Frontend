package com.realestatemarket.listingservice.response;

import com.realestatemarket.listingservice.dto.UserInfor;
import com.realestatemarket.listingservice.entity.Property;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class PropertyWithTier {
    @NonNull
    private Property property;
    @NonNull
    private String postTier;
    @NonNull
    private UserInfor userInfor;
}