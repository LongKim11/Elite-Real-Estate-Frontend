package com.realestatemarket.rentalservice.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.enums.ViewingStatus;


public interface ViewingRepository extends JpaRepository<Viewing, UUID> {
    List<Viewing> findByPropertyId(UUID propertyId);
    @Query("SELECT COUNT(v) FROM Viewing v WHERE v.status = ?1")
    Long countByStatus(ViewingStatus status);

    @Query("SELECT v.propertyId, COUNT(v) FROM Viewing v GROUP BY v.propertyId")
    List<Object[]> countByPropertyId();

    @Query("SELECT COUNT(DISTINCT v.viewerEmail) FROM Viewing v WHERE v.viewerEmail IS NOT NULL")
    Long countUniqueViewersByEmail();

    @Query("SELECT COUNT(DISTINCT v.viewerPhone) FROM Viewing v WHERE v.viewerPhone IS NOT NULL")
    Long countUniqueViewersByPhone();

    @Query("SELECT COUNT(v) FROM Viewing v WHERE v.scheduledAt BETWEEN ?1 AND ?2")
    Long countInPeriod(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(v) FROM Viewing v WHERE v.scheduledAt BETWEEN ?1 AND ?2 AND v.status = ?3")
    Long countInPeriodByStatus(LocalDateTime start, LocalDateTime end, ViewingStatus status);
}