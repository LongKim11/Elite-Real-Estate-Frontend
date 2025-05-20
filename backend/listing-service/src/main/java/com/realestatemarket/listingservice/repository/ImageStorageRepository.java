package com.realestatemarket.listingservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.realestatemarket.listingservice.entity.ImageStorage;

public interface ImageStorageRepository extends JpaRepository<ImageStorage, UUID> {}