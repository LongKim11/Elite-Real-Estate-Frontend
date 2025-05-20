package com.realestatemarket.listingservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.realestatemarket.listingservice.entity.Land;

public interface LandRepository extends JpaRepository<Land, UUID>, JpaSpecificationExecutor<Land> {
}