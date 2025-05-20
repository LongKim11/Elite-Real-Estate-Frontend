package com.realestatemarket.listingservice.mediator.mediator;

import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.mediator.command.Command;

@Component
public class ViewingMediator implements Mediator {

    @Override
    public void send(Command command) {
        command.handle();
    }
}