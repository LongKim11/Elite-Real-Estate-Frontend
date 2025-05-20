package com.realestatemarket.rentalservice.mediator.command;

import java.util.UUID;

import com.realestatemarket.rentalservice.mediator.handler.CompleteViewingHandler;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompleteViewingCommand implements Command {
    private final UUID viewingId;
    private final CompleteViewingHandler handler;

    @Override
    public void handle() {
        handler.handle(this);
    }
}