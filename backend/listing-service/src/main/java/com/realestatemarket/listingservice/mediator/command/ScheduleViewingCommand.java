package com.realestatemarket.listingservice.mediator.command;

import com.realestatemarket.listingservice.request.ViewingRequest;
import com.realestatemarket.listingservice.mediator.handler.ScheduleViewingHandler;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ScheduleViewingCommand implements Command {
    private final ViewingRequest viewingRequest;
    private final ScheduleViewingHandler handler;

    @Override
    public void handle() {
        handler.handle(this);
    }
}