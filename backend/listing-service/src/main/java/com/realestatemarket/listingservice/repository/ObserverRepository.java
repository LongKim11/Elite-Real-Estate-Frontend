package com.realestatemarket.listingservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.realestatemarket.listingservice.entity.Observer;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.List;

public interface ObserverRepository extends JpaRepository<Observer, UUID> {
    @Query("SELECT COUNT(o) > 0 FROM Observer o WHERE o.property.id = :propertyId AND o.phoneNumber = :phoneNumber")
    boolean existsByPropertyAndPhone(
        @Param("propertyId") UUID propertyId, 
        @Param("phoneNumber") String phoneNumber
    );
    List<Observer> findByPhoneNumber(String phoneNumber);

    @Query("SELECT o FROM Observer o WHERE o.property.propertyId = :propertyId")
    List<Observer> findByPropertyId(@Param("propertyId") UUID propertyId);
}
