package com.realestatemarket.authenticationservice.request;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class TransactionRequest {
    private String userId;  
    private double amount;  
    private TransactionType type;

    public enum TransactionType {
        DEPOSIT,
        WITHDRAWAL
    }
}

