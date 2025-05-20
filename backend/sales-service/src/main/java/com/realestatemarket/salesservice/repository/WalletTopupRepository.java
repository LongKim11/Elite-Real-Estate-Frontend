package com.realestatemarket.salesservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.realestatemarket.salesservice.entity.WalletTopup;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

import org.springframework.data.jpa.repository.Query;

public interface WalletTopupRepository extends JpaRepository<WalletTopup, UUID> {
    List<WalletTopup> findByPhoneNumber(String phoneNumber);
    @Query("SELECT COUNT(w) FROM WalletTopup w WHERE w.status = ?1")
    Long countByStatus(boolean status);

    @Query("SELECT SUM(w.amount) FROM WalletTopup w WHERE w.status = ?1")
    Double sumAmountByStatus(boolean status);

    @Query("SELECT AVG(w.amount) FROM WalletTopup w WHERE w.status = ?1")
    Double avgAmountByStatus(boolean status);

    @Query("SELECT w.phoneNumber, COUNT(w) FROM WalletTopup w GROUP BY w.phoneNumber")
    List<Object[]> countByPhoneNumber();

    @Query("SELECT SUM(w.amount) FROM WalletTopup w WHERE w.createdTime BETWEEN ?1 AND ?2")
    Double sumAmountInPeriod(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(w.amount) FROM WalletTopup w WHERE w.createdTime BETWEEN ?1 AND ?2 AND w.status = ?3")
    Double sumAmountInPeriodByStatus(LocalDateTime start, LocalDateTime end, boolean status);

    @Query("SELECT SUM(w.amount) FROM WalletTopup w")
    Double sumAmount();
}
