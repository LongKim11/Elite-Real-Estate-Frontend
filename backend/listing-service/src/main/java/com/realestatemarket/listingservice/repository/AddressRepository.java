package com.realestatemarket.listingservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.realestatemarket.listingservice.entity.Address;

public interface AddressRepository extends JpaRepository<Address, String> {
    Optional<Address> findByAddressId(String addressId);

}