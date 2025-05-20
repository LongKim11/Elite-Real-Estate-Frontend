package com.realestatemarket.rentalservice.mediator.colleague;

import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.request.ViewingRequest;

public interface Colleague {
    void handle(EventType eventType, ViewingRequest payload);
}