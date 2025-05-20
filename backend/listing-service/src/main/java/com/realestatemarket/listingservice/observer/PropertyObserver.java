package com.realestatemarket.listingservice.observer;

import com.realestatemarket.listingservice.observer.event.PropertyUpdateEvent;

public interface PropertyObserver {
    void update(PropertyUpdateEvent event);
    String getObserverId();
}
