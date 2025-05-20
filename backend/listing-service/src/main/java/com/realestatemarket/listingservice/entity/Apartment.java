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
public class Apartment extends Property {
    @Column(name = "num_bedrooms")
    private int numBedrooms;

    @Column(name = "num_bathrooms")
    private int numBathrooms;

    @Column(name = "floor")
    private int floor;

    @Column(name = "building_name")
    private String buildingName;

    @Column(name = "has_balcony")
    private boolean hasBalcony;

    @Column(name = "maintenance_fee")
    private double maintenanceFee;

    @Column(name = "parking_availability")
    private boolean parkingAvailability;

    @JsonManagedReference
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ImageStorage> images;

    @Override
    protected boolean validateField(PropertyRequest propertyRequest) {
        if (propertyRequest.getNumBedrooms() <= 0) 
            return false;
        if (propertyRequest.getNumBathrooms() <= 0) 
            return false;
        if (propertyRequest.getFloor() <= 0) 
            return false;
        if (propertyRequest.getBuildingName() == null || propertyRequest.getBuildingName().isEmpty())
            return false;
        if (propertyRequest.getMaintenanceFee() < 0)
            return false;
        return true;
    }
}
