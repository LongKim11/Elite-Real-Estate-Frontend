package com.realestatemarket.listingservice.entity;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.realestatemarket.listingservice.observer.PropertyObserver;
import com.realestatemarket.listingservice.observer.event.PropertyUpdateEvent;
import com.realestatemarket.listingservice.services.SendEmailService;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
// @AllArgsConstructor
public class Observer implements PropertyObserver {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "observer_id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "property_id", nullable = false) 
    private Property property;

    private String email;
    private String phoneNumber;

    @Transient 
    private transient SendEmailService emailService;

    @Override
    public void update(PropertyUpdateEvent event) {
        if (emailService == null) {
            return;
        }

        String subject = "📢 Property Update: " + event.getPropertyTitle();    
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        LocalDateTime updateTime = event.getUpdateTime(); 
        String formattedUpdateTime = dateFormat.format(java.sql.Timestamp.valueOf(updateTime)); 
        String body = String.format(
            "<h2>Property Update Information</h2>" +
            "<p><strong>Property ID:</strong> %s</p>" +
            "<p><strong>Title:</strong> %s</p>" +
            "<p><strong>Update Type:</strong> %s</p>" +
            "<p><strong>Description:</strong> %s</p>" +
            "<p><strong>Time:</strong> %s</p>",
            event.getPropertyId(),
            event.getPropertyTitle(),
            event.getUpdateType(),
            event.getUpdateDescription(),
            formattedUpdateTime
        );

        try {
            emailService.sendHtmlEmail(email, subject, body);
        } catch (Exception ex) {}
    }

    @Override
    public String getObserverId() {
        return "db-observer-" + id.toString();
    }
}
