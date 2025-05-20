package com.realestatemarket.listingservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.realestatemarket.listingservice.entity.Property;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {
    // @EntityGraph(attributePaths = {"observers"})
    // Optional<Property> findWithObserversById(UUID observer_id);
    List<Property> findByUserId(String userId);

    @Query("SELECT COUNT(p) FROM Property p WHERE TYPE(p) = ?1")
    Long countByType(Class<? extends Property> type);

    @Query("SELECT AVG(p.price) FROM Property p WHERE TYPE(p) = ?1")
    Double findAveragePriceByType(Class<? extends Property> type);

    @Query("SELECT DISTINCT p.category FROM Property p")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT p.typeTransaction FROM Property p")
    List<String> findDistinctTransactionTypes();

    @Query("SELECT COUNT(p) FROM Property p WHERE p.category = ?1 AND p.typeTransaction = ?2")
    Long countByCategoryAndTypeTransaction(String category, String transactionType);
}
