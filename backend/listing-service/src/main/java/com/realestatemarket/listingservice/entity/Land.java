package com.realestatemarket.listingservice.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.realestatemarket.listingservice.request.PropertyRequest;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Land extends Property {
    @Column(name = "land_type")
    private String landType; 
    @Column(name = "zoning_type")
    private String zoningType;
    @Column(name = "road_frontage")
    private double roadFrontage;
    @Column(name = "legal_status")
    private String legalStatus; 
    @Column(name = "can_build")
    private boolean canBuild;
    @Column(name = "land_usage_duration")
    private String landUsageDuration; 

    @JsonManagedReference
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImageStorage> images;

    @Override
    protected boolean validateField(PropertyRequest propertyRequest) {
        if (propertyRequest.getLandType() == null || propertyRequest.getLandType().isEmpty())
            return false; 
        if (propertyRequest.getZoningType() == null || propertyRequest.getZoningType().isEmpty()) 
            return false; 
        if (propertyRequest.getLegalStatus() == null || propertyRequest.getLegalStatus().isEmpty())
            return false;
        if (propertyRequest.getRoadFrontage() <= 0) 
            return false;
        if (propertyRequest.getLandUsageDuration() == null || propertyRequest.getLandUsageDuration().isEmpty())  
            return false; 
        return true; 
    }
}