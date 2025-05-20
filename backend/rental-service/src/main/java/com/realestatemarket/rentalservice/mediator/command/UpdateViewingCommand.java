package com.realestatemarket.rentalservice.mediator.command;


import java.util.UUID;

import com.realestatemarket.rentalservice.mediator.handler.UpdateViewingHandler;
import com.realestatemarket.rentalservice.request.UpdateViewingRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateViewingCommand implements Command {
    private final UUID viewingId;
    private final UpdateViewingRequest viewingRequest;
    private final UpdateViewingHandler handler;

    @Override
    public void handle() {
        handler.handle(this);
    }
}