package com.realestatemarket.rentalservice.mediator.handler;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.enums.ViewingStatus;
import com.realestatemarket.rentalservice.mediator.command.CompleteViewingCommand;
import com.realestatemarket.rentalservice.repository.ViewingRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CompleteViewingHandler {
    private final ViewingRepository repository;

    public void handle(CompleteViewingCommand command) {
        Viewing viewing = repository.findById(command.getViewingId())
                .orElseThrow(() -> new RuntimeException("Viewing not found"));
        viewing.setStatus(ViewingStatus.COMPLETED);
        repository.save(viewing);
    }
}
