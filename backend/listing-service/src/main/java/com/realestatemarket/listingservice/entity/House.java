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
public class House extends Property {
    @Column(name = "num_bedrooms")
    private int numBedrooms;

    @Column(name = "num_bathrooms")
    private int numBathrooms;

    @Column(name = "num_floors")
    private int numFloors;

    @Column(name = "has_garden")
    private boolean hasGarden;

    @Column(name = "has_garage")
    private boolean hasGarage;

    @Column(name = "land_area")
    private double landArea;

    @Column(name = "house_type")
    private String houseType; 

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
        if (propertyRequest.getLandArea() <= 0) 
            return false;
        if (propertyRequest.getHouseType() == null || propertyRequest.getHouseType().isEmpty())
            return false;
        return true;
    }
}
