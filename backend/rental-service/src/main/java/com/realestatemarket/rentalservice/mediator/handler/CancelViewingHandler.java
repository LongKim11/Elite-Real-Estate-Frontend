package com.realestatemarket.rentalservice.mediator.handler;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.enums.ViewingStatus;
import com.realestatemarket.rentalservice.mediator.command.CancelViewingCommand;
import com.realestatemarket.rentalservice.repository.ViewingRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CancelViewingHandler {
    private final ViewingRepository repository;

    public void handle(CancelViewingCommand command) {
        Viewing viewing = repository.findById(command.getViewingId())
                .orElseThrow(() -> new RuntimeException("Viewing not found"));
        viewing.setStatus(ViewingStatus.CANCELLED);
        repository.save(viewing);
    }
}
