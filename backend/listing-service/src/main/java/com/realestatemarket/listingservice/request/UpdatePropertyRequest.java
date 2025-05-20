package com.realestatemarket.listingservice.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePropertyRequest {

    private double price;
    private String title;
    private String fullAddress;
    private String projectName;
    private String description;
    private String typeTransaction;
    private double squareMeters;
    private String longitude;
    private String latitude;

    // Common fields for apartment, house
    // Apartment specific fields
    private int numBedrooms;
    private int numBathrooms;
    private int floor;

    // Apartment specific fields
    private String buildingName;
    private boolean hasBalcony;
    private double maintenanceFee;
    private boolean parkingAvailability;

    // House specific fields
    private boolean hasGarden;
    private boolean hasGarage;
    private double landArea;
    private String houseType;

    // Land specific fields
    private String landType;
    private String zoningType;
    private double roadFrontage;
    private String legalStatus;
    private boolean canBuild;
    private String landUsageDuration;
}

