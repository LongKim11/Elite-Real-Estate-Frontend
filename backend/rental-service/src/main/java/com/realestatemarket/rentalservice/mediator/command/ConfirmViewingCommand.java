package com.realestatemarket.rentalservice.mediator.command;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import com.realestatemarket.rentalservice.mediator.handler.ConfirmViewingHandler; 

@Getter
@AllArgsConstructor
public class ConfirmViewingCommand implements Command {
    private final UUID viewingId;
    private final ConfirmViewingHandler handler;

    @Override
    public void handle() {
        handler.handle(this);
    }
}