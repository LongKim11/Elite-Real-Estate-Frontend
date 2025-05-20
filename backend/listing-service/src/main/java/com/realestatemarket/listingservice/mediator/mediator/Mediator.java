package com.realestatemarket.listingservice.mediator.mediator;

import com.realestatemarket.listingservice.mediator.command.Command;

public interface Mediator {
    void send(Command command);
}