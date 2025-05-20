package com.realestatemarket.rentalservice.mediator.handler;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.enums.ViewingStatus;
import com.realestatemarket.rentalservice.mediator.command.ConfirmViewingCommand;
import com.realestatemarket.rentalservice.repository.ViewingRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ConfirmViewingHandler {
    private final ViewingRepository repository;

    public void handle(ConfirmViewingCommand command) {
        Viewing viewing = repository.findById(command.getViewingId())
                .orElseThrow(() -> new RuntimeException("Viewing not found"));
        viewing.setStatus(ViewingStatus.CONFIRMED);
        repository.save(viewing);
    }
}
