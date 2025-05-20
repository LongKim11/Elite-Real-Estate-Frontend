package com.realestatemarket.rentalservice.mediator.mediator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.mediator.colleague.Colleague;
import com.realestatemarket.rentalservice.request.ViewingRequest;


@Component
public class ViewingMediator implements Mediator {
    private final Map<EventType, List<Colleague>> colleagues = new HashMap<>();

    @Override
    public void register(Colleague colleague, EventType eventType) {
        colleagues.computeIfAbsent(eventType, k -> new ArrayList<>()).add(colleague);
    }

    @Override
    public void notify(Object sender, EventType eventType, ViewingRequest payload) {
        for (Colleague colleague : colleagues.getOrDefault(eventType, Collections.emptyList())) {
            if (colleague != sender) { 
                colleague.handle(eventType, payload);
            }
        }
    }
}
