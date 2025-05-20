package com.realestatemarket.rentalservice.mediator.colleague;

import javax.swing.text.View;

import org.springframework.stereotype.Component;

import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.kafka.SendEmailKafkaProducer;
import com.realestatemarket.rentalservice.mediator.mediator.Mediator;
import com.realestatemarket.rentalservice.mediator.mediator.ViewingMediator;
import com.realestatemarket.rentalservice.request.NotificationRequest;
import com.realestatemarket.rentalservice.request.ViewingRequest;

@Component
public class Buyer implements Colleague {
    private final Mediator mediator;
    private final SendEmailKafkaProducer sendEmailKafkaProducer;

    public Buyer(ViewingMediator mediator, SendEmailKafkaProducer sendEmailKafkaProducer) {
        this.mediator = mediator;
        this.sendEmailKafkaProducer = sendEmailKafkaProducer;

        mediator.register(this, EventType.VIEWING_CONFIRMED);
        mediator.register(this, EventType.VIEWING_CANCELLED);
        mediator.register(this, EventType.VIEWING_RESCHEDULED);
        
    }
 
    public void scheduleViewing(ViewingRequest request) {
        mediator.notify(this, EventType.VIEWING_SCHEDULED, request);
    }

    @Override
    public void handle(EventType eventType, ViewingRequest request) {
        // if (EventType.VIEWING_CONFIRMED.equals(eventType)) {
        //     System.out.println("Buyer nhận thông báo xác nhận lịch");
        // } else if (EventType.VIEWING_CANCELLED.equals(eventType)) {
        //     System.out.println("Buyer nhận thông báo hủy lịch");
        // } else if (EventType.VIEWING_RESCHEDULED.equals(eventType)) {
        //     System.out.println("Buyer nhận thông báo thay đổi lịch");
        // } else if (EventType.VIEWING_COMPLETED.equals(eventType)) {
        //     System.out.println("Buyer nhận thông báo hoàn thành lịch");
        // }

        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setName(request.getViewerName());
        notificationRequest.setEmail(request.getViewerEmail());
        notificationRequest.setNumberPhone(request.getViewerPhone());
        notificationRequest.setPropertyId(request.getPropertyId().toString());
        notificationRequest.setViewingDateTime(request.getScheduledAt().toString());
        notificationRequest.setStatus("UPDATE_SCHEDULED");
        sendEmailKafkaProducer.sendNotification(notificationRequest);

    }
}