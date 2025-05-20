package com.realestatemarket.listingservice.services;

import org.springframework.stereotype.Service;

import com.realestatemarket.listingservice.mediator.command.ScheduleViewingCommand;
import com.realestatemarket.listingservice.mediator.handler.ScheduleViewingHandler;
import com.realestatemarket.listingservice.mediator.mediator.Mediator;
import com.realestatemarket.listingservice.request.ViewingRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewingService {

    private final Mediator mediator;
    private final ScheduleViewingHandler scheduleViewingHandler;

    public void scheduleViewing(ViewingRequest request) {
        ScheduleViewingCommand command = new ScheduleViewingCommand(request, scheduleViewingHandler);
        mediator.send(command);
    }
}