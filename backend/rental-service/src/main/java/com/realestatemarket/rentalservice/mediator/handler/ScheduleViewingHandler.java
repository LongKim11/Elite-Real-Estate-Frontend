package com.realestatemarket.rentalservice.mediator.handler;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.mediator.command.ScheduleViewingCommand;
import com.realestatemarket.rentalservice.repository.ViewingRepository;
import com.realestatemarket.rentalservice.request.ViewingRequest;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ScheduleViewingHandler {
    private final ViewingRepository viewingRepository;


    public void handle(ScheduleViewingCommand command) {
        ViewingRequest request = command.getViewingRequest();

        Viewing viewing = new Viewing();
        viewing.setPropertyId(request.getPropertyId());
        viewing.setViewerName(request.getViewerName());
        viewing.setViewerPhone(request.getViewerPhone());
        viewing.setViewerEmail(request.getViewerEmail());
        viewing.setScheduledAt(request.getScheduledAt());
        viewing.setViewNotes(request.getViewNotes());

        viewingRepository.save(viewing);
        

    }
}