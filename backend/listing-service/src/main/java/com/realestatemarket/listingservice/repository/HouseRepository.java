package com.realestatemarket.listingservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.realestatemarket.listingservice.entity.House;

@Repository
public interface HouseRepository extends JpaRepository<House, UUID>, JpaSpecificationExecutor<House>{
}