package com.realestatemarket.rentalservice.mediator.handler;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.mediator.command.UpdateViewingCommand;
import com.realestatemarket.rentalservice.repository.ViewingRepository;
import com.realestatemarket.rentalservice.request.UpdateViewingRequest;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UpdateViewingHandler {
    private final ViewingRepository viewingRepository;


    public void handle(UpdateViewingCommand command) {
        UpdateViewingRequest request = command.getViewingRequest();

        Viewing viewing = viewingRepository.findById(command.getViewingId())
                                        .orElseThrow(() -> new RuntimeException("Viewing not found"));

        viewing.setViewerName(request.getViewerName());
        viewing.setViewerPhone(request.getViewerPhone());
        viewing.setViewerEmail(request.getViewerEmail());
        viewing.setScheduledAt(request.getScheduledAt());
        viewing.setViewNotes(request.getViewNotes());

        viewingRepository.save(viewing);
        

    }
}