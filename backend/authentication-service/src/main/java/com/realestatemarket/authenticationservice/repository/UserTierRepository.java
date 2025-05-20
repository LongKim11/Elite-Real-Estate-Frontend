package com.realestatemarket.authenticationservice.repository;

import com.realestatemarket.authenticationservice.entity.UserTier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTierRepository extends JpaRepository<UserTier, Long> {
    Optional<UserTier> findByName(String name);
    UserTier findByIsDefaultTrue();
}
