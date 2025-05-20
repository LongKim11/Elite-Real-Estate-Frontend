package com.realestatemarket.rentalservice.mediator.mediator;

// import com.realestatemarket.rentalservice.mediator.command.Command;

import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.mediator.colleague.Colleague;
import com.realestatemarket.rentalservice.request.ViewingRequest;


public interface Mediator {
    void register(Colleague colleague, EventType eventType);
    void notify(Object sender, EventType eventType, ViewingRequest request);
}