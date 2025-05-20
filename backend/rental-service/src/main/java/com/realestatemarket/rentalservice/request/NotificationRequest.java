package com.realestatemarket.rentalservice.request;

import lombok.Data;

@Data
public class NotificationRequest {
    private String name;
    private String email;
    private String numberPhone;
    private String propertyId;
    private String viewingDateTime;
    private String status; 
}