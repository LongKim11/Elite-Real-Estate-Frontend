package com.realestatemarket.listingservice.repository;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.realestatemarket.listingservice.entity.Viewing;

public interface ViewingRepository extends JpaRepository<Viewing, UUID> {
    @Query("SELECT COUNT(v) FROM Viewing v WHERE TYPE(v.property) = ?1")
    Long countViewingsByPropertyType(Class<?> propertyType);

    @Query("SELECT COUNT(v) FROM Viewing v WHERE v.scheduledAt BETWEEN ?1 AND ?2")
    Long countViewingsInPeriod(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT v.viewerId) FROM Viewing v WHERE v.scheduledAt BETWEEN ?1 AND ?2")
    Long countUniqueViewersInPeriod(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(v) FROM Viewing v WHERE TYPE(v.property) = ?1 AND v.scheduledAt BETWEEN ?2 AND ?3")
    Long countViewingsByPropertyTypeInPeriod(Class<?> propertyType, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(DISTINCT v.viewerId) FROM Viewing v")
    Long countUniqueViewers();
}
