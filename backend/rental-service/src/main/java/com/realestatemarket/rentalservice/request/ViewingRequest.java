package com.realestatemarket.rentalservice.request;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class ViewingRequest {
    private UUID propertyId;
    private String viewerName;
    private String viewerPhone;
    private String viewerEmail;
    private String viewNotes;
    private LocalDateTime scheduledAt;
}
