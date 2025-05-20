package com.realestatemarket.listingservice.services.factory;

import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class PropertyFactoryProvider {
    private final Map<String, PropertyFactory> factoryMap;

    public PropertyFactoryProvider(ApartmentFactory apartmentFactory,
                                   HouseFactory houseFactory,
                                   LandFactory landFactory) {
        factoryMap = Map.of(
            "apartment", apartmentFactory,
            "house", houseFactory,
            "land", landFactory
        );
    }

    public PropertyFactory getFactory(String propertyType) {
        return factoryMap.getOrDefault(propertyType.toLowerCase(), null);
    }
}
