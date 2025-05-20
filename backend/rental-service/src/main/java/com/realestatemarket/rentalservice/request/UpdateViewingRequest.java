package com.realestatemarket.rentalservice.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UpdateViewingRequest {
    
    private String viewerName;
    private String viewerPhone;
    private String viewerEmail;
    private String viewNotes;
    private LocalDateTime scheduledAt;
}
