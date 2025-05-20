package com.realestatemarket.listingservice.services.factory;

import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.entity.Land;

@Component
public class LandFactory implements PropertyFactory {
    @Override
    public Land createProperty() {
        return new Land();
    }
}