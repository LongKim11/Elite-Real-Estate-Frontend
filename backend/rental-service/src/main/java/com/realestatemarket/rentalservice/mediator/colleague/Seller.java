package com.realestatemarket.rentalservice.mediator.colleague;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.kafka.SendEmailKafkaProducer;
import com.realestatemarket.rentalservice.mediator.mediator.ViewingMediator;
import com.realestatemarket.rentalservice.request.NotificationRequest;
import com.realestatemarket.rentalservice.request.ViewingRequest;

@Component
public class Seller implements Colleague {
    private final ViewingMediator mediator;
    private final SendEmailKafkaProducer sendEmailKafkaProducer;
    
    public Seller(ViewingMediator mediator, SendEmailKafkaProducer sendEmailKafkaProducer) {
        this.mediator = mediator;
        mediator.register(this, EventType.VIEWING_SCHEDULED);
        this.sendEmailKafkaProducer = sendEmailKafkaProducer;
    }

    public void updateScheduled(ViewingRequest request,EventType eventType) {
        mediator.notify(this, eventType, request);
    }

    @Override
    public void handle(EventType eventType, ViewingRequest request) {
        if (EventType.VIEWING_SCHEDULED.equals(eventType)) {
            NotificationRequest notificationRequest = new NotificationRequest();
            notificationRequest.setName(request.getViewerName());
            notificationRequest.setEmail(request.getViewerEmail());
            notificationRequest.setNumberPhone(request.getViewerPhone());
            notificationRequest.setPropertyId(request.getPropertyId().toString());
            notificationRequest.setViewingDateTime(request.getScheduledAt().toString());
            notificationRequest.setStatus("VIEWING_SCHEDULED");
            sendEmailKafkaProducer.sendNotification(notificationRequest);
        }
    }
}