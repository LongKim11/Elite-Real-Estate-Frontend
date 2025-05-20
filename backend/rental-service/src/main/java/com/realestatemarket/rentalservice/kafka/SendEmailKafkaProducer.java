package com.realestatemarket.rentalservice.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Component
public class SendEmailKafkaProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public SendEmailKafkaProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    public void sendNotification(Object notificationRequest) {
        try {
            kafkaTemplate.send("notification-topic", notificationRequest);
        } catch (Exception e) {
            System.out.println("Error sending notification: " + notificationRequest + " | Error: " + e.getMessage());
        }
    }
}