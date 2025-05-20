package com.realestatemarket.rentalservice.mediator.command;


import com.realestatemarket.rentalservice.mediator.handler.ScheduleViewingHandler;
import com.realestatemarket.rentalservice.request.ViewingRequest;

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