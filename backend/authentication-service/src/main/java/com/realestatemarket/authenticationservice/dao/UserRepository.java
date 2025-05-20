package com.realestatemarket.authenticationservice.dao;

import java.time.LocalDateTime;

import com.realestatemarket.authenticationservice.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;

import com.realestatemarket.authenticationservice.enums.Role;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByUserId(UUID userId);
    Optional<User> findByRefreshToken(String refreshToken);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = ?1")
    Long countByRole(Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.status = ?1")
    Long countByStatus(boolean status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.userTier IS NULL")
    Long countByUserTierIsNull();

    @Query("SELECT SUM(u.accountBalance) FROM User u")
    Double sumAccountBalance();

    @Query("SELECT AVG(u.accountBalance) FROM User u")
    Double avgAccountBalance();

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN ?1 AND ?2")
    Long countInPeriod(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN ?1 AND ?2 AND u.role = ?3")
    Long countInPeriodByRole(LocalDateTime start, LocalDateTime end, Role role);
}
