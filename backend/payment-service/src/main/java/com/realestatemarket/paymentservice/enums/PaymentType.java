package com.realestatemarket.paymentservice.enums;

public enum PaymentType {
    POST, PACKAGE;
    public static PaymentType fromString(String value) {
        for (PaymentType type : PaymentType.values()) {
            if (type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unexpected value: " + value);
    }
    
}