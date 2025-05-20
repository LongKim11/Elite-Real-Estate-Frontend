package com.realestatemarket.listingservice.observer;

import com.realestatemarket.listingservice.observer.event.PropertyUpdateEvent;

public interface PropertyObservable {
    void registerObserver(PropertyObserver observer);
    void removeObserver(PropertyObserver observer);
    void notifyObservers(PropertyUpdateEvent event);
}
