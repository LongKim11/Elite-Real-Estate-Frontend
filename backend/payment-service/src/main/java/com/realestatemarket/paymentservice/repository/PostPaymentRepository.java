package com.realestatemarket.paymentservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.realestatemarket.paymentservice.entity.PostPayment;
import com.realestatemarket.paymentservice.enums.PaymentType;
import com.realestatemarket.paymentservice.enums.PostTier;

@Repository
public interface PostPaymentRepository extends JpaRepository<PostPayment, UUID> {
    List<PostPayment> findByUserId(String userId);
    @Query("SELECT COUNT(p) FROM PostPayment p WHERE p.paymentType = ?1 AND p.postTier = ?2")
    Long countByPaymentTypeAndPostTier(PaymentType paymentType, PostTier postTier);

    @Query("SELECT DISTINCT p.status FROM PostPayment p")
    List<String> findDistinctStatuses();

    @Query("SELECT SUM(p.amount) FROM PostPayment p WHERE p.status = ?1 AND p.postTier = ?2")
    Double sumAmountByStatusAndPostTier(String status, PostTier postTier);
}