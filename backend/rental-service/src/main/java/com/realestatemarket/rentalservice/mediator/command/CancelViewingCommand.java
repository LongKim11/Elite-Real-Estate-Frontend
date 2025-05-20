package com.realestatemarket.rentalservice.mediator.command;

import java.util.UUID;

import com.realestatemarket.rentalservice.mediator.handler.CancelViewingHandler;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class CancelViewingCommand implements Command {
    private final UUID viewingId;
    private final CancelViewingHandler handler;

    @Override
    public void handle() {
        handler.handle(this);
    }
}