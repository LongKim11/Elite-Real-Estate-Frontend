package com.realestatemarket.listingservice.kafka;

import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestatemarket.listingservice.repository.PropertyRepository;
import com.realestatemarket.listingservice.services.SendEmailService;
import com.realestatemarket.listingservice.entity.Property;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ListingKafkaConsumer {
    private final PropertyRepository propertyRepository;
    private final SendEmailService sendEmailService;

    public ListingKafkaConsumer(PropertyRepository propertyRepository,
                                SendEmailService sendEmailService
                            ) {

        this.propertyRepository = propertyRepository;   
        this.sendEmailService = sendEmailService;
    }

    @KafkaListener(topics = "notification-topic", groupId = "real-estate-group")
    public void consumeTransaction(String message) {
        try {
            // Deserialize the message into a TransactionRequest object
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Map<String, Object> map = mapper.readValue(message, Map.class);

            String name = (String) map.get("name");
            String email = (String) map.get("email");
            String numberPhone = (String) map.get("numberPhone");
            UUID propertyId = UUID.fromString(map.get("propertyId").toString());
            String viewingDateTimeStr = (String) map.get("viewingDateTime");
            String status = (String) map.get("status");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime viewingDateTime = LocalDateTime.parse(viewingDateTimeStr, formatter);

            // Fetch the property details from the database using the propertyId
            Property property = propertyRepository.findById(propertyId)
                    .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + propertyId));

            switch (status) {
                case "VIEWING_SCHEDULED" -> {
                    // Prepare and send email when the viewing is scheduled
                    String scheduledHtmlContent = "<h1>Property Viewing Scheduled</h1>" +
                            "<p>Dear " + name + ",</p>" +
                            "<p>Your property viewing has been scheduled for " + viewingDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + ".</p>" +
                            "<p>Property Name: " + property.getTitle() + "</p>" +
                            "<p>Property Address: " + property.getFullAddress() + "</p>" +
                            "<p>Thank you!</p>";
                    sendEmailService.sendHtmlEmail(email, "Property Viewing Scheduled", scheduledHtmlContent);
                }

                case "UPDATE_SCHEDULED" -> {
                    // Change scheduled viewing details and send email
                    String completedHtmlContent = "<h1>Property Updated</h1>" +
                            "<p>Dear " + name + ",</p>" +
                            "<p>your property has been updated.</p>" +
                            "<p>Property Name: " + property.getTitle() + "</p>" +
                            "<p>Property Address: " + property.getFullAddress() + "</p>" +
                            "<p>Thank you for your time!</p>";
                    sendEmailService.sendHtmlEmail(email, "Property Updated", completedHtmlContent);
                }
                default -> throw new IllegalArgumentException("Unknown status: " + status);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to process transaction", e);
        }
    }
}