package com.realestatemarket.listingservice.observer.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyUpdateEvent {
    private UUID propertyId;
    private String propertyTitle;
    private LocalDateTime updateTime;
    private String updateDescription;
    private String changedBy;
    private UpdateType updateType;

    public enum UpdateType {
        PRICE_CHANGE,
        STATUS_CHANGE,
        MEDIA_UPDATE,
        LOCATION_UPDATE,
        OTHER
    }
}
