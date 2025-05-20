package com.realestatemarket.listingservice.mediator.handler;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.entity.Property;
import com.realestatemarket.listingservice.entity.Viewing;
import com.realestatemarket.listingservice.mediator.command.ScheduleViewingCommand;
import com.realestatemarket.listingservice.repository.PropertyRepository;
import com.realestatemarket.listingservice.repository.ViewingRepository;
import com.realestatemarket.listingservice.request.ViewingRequest;
import com.realestatemarket.listingservice.services.SendEmailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ScheduleViewingHandler {

    private final PropertyRepository propertyRepository;
    private final ViewingRepository viewingRepository;
    private final SendEmailService sendEmailService;

    public void handle(ScheduleViewingCommand command) {
        ViewingRequest request = command.getViewingRequest();

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Viewing viewing = new Viewing();
        viewing.setProperty(property);
        viewing.setViewerId(UUID.randomUUID());
        viewing.setViewerName(request.getViewerName());
        viewing.setViewerPhone(request.getViewerPhone());
        viewing.setViewerEmail(request.getViewerEmail());
        viewing.setScheduledAt(request.getScheduledAt());

        viewingRepository.save(viewing);
        
        // Send email confirmation
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedDate = request.getScheduledAt()
                .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(formatter);
        
        String message = "Hello " + request.getViewerName() + ",\n\n" +
                "You have scheduled a viewing for the property \"" + property.getTitle() + "\" at " + formattedDate + ".";
        
        sendEmailService.sendHtmlEmail(
                request.getViewerEmail(),
                "Viewing Appointment Confirmation",
                message
        );
    }
}