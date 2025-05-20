package com.realestatemarket.listingservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.realestatemarket.listingservice.observer.PropertyObservable;
import com.realestatemarket.listingservice.observer.PropertyObserver;
import com.realestatemarket.listingservice.observer.event.PropertyUpdateEvent;
import com.realestatemarket.listingservice.request.PropertyRequest;
import com.realestatemarket.listingservice.services.SendEmailService;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED) 
@Table(name = "property")
public abstract class Property implements PropertyObservable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "property_id", updatable = false, nullable = false)
    private UUID propertyId;

    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private double price;
    private double squareMeters;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String title;
    private String category;
    private String typeTransaction; 

    private String longitude;
    private String latitude;
    
    private String projectName;
    private String fullAddress;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "expire_time")
    private LocalDateTime expireTime;

    @JsonManagedReference
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Observer> observers = new ArrayList<>();

    // Template Method
    public final boolean createProperty(PropertyRequest propertyRequest) {
        if (!vailidateBasicCommon(propertyRequest)) 
            return false;
        if (!validateField(propertyRequest)) 
            return false;
        return true;
    }

    // Method to set basic information for the property
    protected boolean vailidateBasicCommon(PropertyRequest propertyRequest) {
        if (propertyRequest.getUserId() == null) 
            return false;
        if (propertyRequest.getAddress() == null) 
            return false;
        if (propertyRequest.getPrice() <= 0) 
            return false;
        if (propertyRequest.getSquareMeters() <= 0)
            return false;
        if (propertyRequest.getDescription() == null || propertyRequest.getDescription().isEmpty()) 
            return false;
        if (propertyRequest.getTitle() == null || propertyRequest.getTitle().isEmpty())
            return false;
        if (propertyRequest.getCategory() == null || propertyRequest.getCategory().isEmpty()) 
            return false;
        if (propertyRequest.getTypeTransaction() == null || propertyRequest.getTypeTransaction().isEmpty()) 
            return false;
        if (propertyRequest.getLongitude() == null || propertyRequest.getLongitude().isEmpty()) 
            return false;
        if (propertyRequest.getLatitude() == null || propertyRequest.getLatitude().isEmpty()) 
            return false;
        if (propertyRequest.getProjectName() == null || propertyRequest.getProjectName().isEmpty()) 
            return false;
        if (propertyRequest.getFullAddress() == null || propertyRequest.getFullAddress().isEmpty()) 
            return false;
        if (propertyRequest.getStartTime() == null) 
            return false;
        if (propertyRequest.getExpireTime() == null) 
            return false;
        if (propertyRequest.getExpireTime().isBefore(propertyRequest.getStartTime())) 
            return false;
        return true;

    }
    protected abstract boolean validateField(PropertyRequest propertyRequest);

    @Transient
    private transient List<PropertyObserver> propertyObservers = new ArrayList<>();

    @Override
    public void registerObserver(PropertyObserver observer) {
        propertyObservers.add(observer);
    }

    @Override
    public void removeObserver(PropertyObserver observer) {
        propertyObservers.removeIf(o -> o.getObserverId().equals(observer.getObserverId()));
    }

    @Override
    public void notifyObservers(PropertyUpdateEvent event) {
        // Notify in-memory observers
        propertyObservers.forEach(o -> o.update(event));

        // Notify persistent observers
        observers.forEach(o -> o.update(event));
    }

    public void addPersistentObserver(String email, String phoneNumber, SendEmailService emailService) {
        Observer observer = new Observer(); 
        observer.setProperty(this);        
        observer.setEmail(email); 
        observer.setPhoneNumber(phoneNumber);          
        observer.setEmailService(emailService); 
        observers.add(observer);
    }


}