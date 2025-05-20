package com.realestatemarket.listingservice.services.factory;

import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.entity.Apartment;

@Component
public class ApartmentFactory implements PropertyFactory {
    @Override
    public Apartment createProperty() {
        return new Apartment();
    }
}