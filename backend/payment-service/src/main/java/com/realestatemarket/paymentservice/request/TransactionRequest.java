package com.realestatemarket.paymentservice.request;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.realestatemarket.paymentservice.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS)
public class TransactionRequest {
    private String userId;  
    private double amount;  
    private TransactionType type;
}

