package com.realestatemarket.authenticationservice.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.realestatemarket.authenticationservice.entity.UserTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthenticationResponse {
    private UUID id;
    private String name;
    private String token;
    private String role;
    private double balance;
    private UserTier userTier;
}
