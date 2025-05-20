package com.realestatemarket.listingservice.services.factory;

import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.entity.House;

@Component
public class HouseFactory implements PropertyFactory {
    @Override
    public House createProperty() {
        return new House();
    }
}
