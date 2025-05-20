package com.realestatemarket.paymentservice.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.realestatemarket.paymentservice.entity.UserPostQuota;

@Repository
public interface UserPostQuotaRepository extends JpaRepository<UserPostQuota, UUID> {
    Optional<List<UserPostQuota>> findByUserId(String userId);
    @Query("SELECT AVG(q.vipGoldRemaining) FROM UserPostQuota q")
    Double findAverageVipGoldRemaining();

    @Query("SELECT AVG(q.vipSilverRemaining) FROM UserPostQuota q")
    Double findAverageVipSilverRemaining();

    @Query("SELECT AVG(q.regularRemaining) FROM UserPostQuota q")
    Double findAverageRegularRemaining();

    @Query("SELECT COUNT(q) FROM UserPostQuota q WHERE q.expiredAt IS NOT NULL AND q.expiredAt <= ?1")
    Long countExpiredQuotas(LocalDateTime now);

    @Query("SELECT COUNT(q) FROM UserPostQuota q WHERE q.expiredAt IS NOT NULL AND q.expiredAt > ?1 AND q.expiredAt <= ?2")
    Long countQuotasExpiringSoon(LocalDateTime now, LocalDateTime threshold);

    @Query("SELECT COUNT(q) FROM UserPostQuota q WHERE q.vipGoldRemaining = 0 AND q.vipSilverRemaining = 0 AND q.regularRemaining = 0")
    Long countAllZeroQuotas();

    @Query("SELECT q.packetName, COUNT(q) FROM UserPostQuota q WHERE q.packetName IS NOT NULL GROUP BY q.packetName")
    List<Object[]> countByPacketName();

    @Query("SELECT q.packetName, SUM(q.amountPaid) FROM UserPostQuota q WHERE q.packetName IS NOT NULL GROUP BY q.packetName")
    List<Object[]> sumAmountPaidByPacketName();
}