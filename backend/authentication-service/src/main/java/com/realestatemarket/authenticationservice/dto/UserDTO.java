package com.realestatemarket.authenticationservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.realestatemarket.authenticationservice.entity.User;
import jakarta.persistence.*;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private UUID id;
    private String email;
    private String phone;
    private String fullName;
    private double balance;
    private boolean inActive;

    public static UserDTO toDTO(User user){
        return  UserDTO.builder().
                id(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .inActive(user.isStatus())
                .phone(user.getPhone())
                .balance(Optional.ofNullable(user.getAccountBalance()).orElse(0.0))
                .build();
    }
}
