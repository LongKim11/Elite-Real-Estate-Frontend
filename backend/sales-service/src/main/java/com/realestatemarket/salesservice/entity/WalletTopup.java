package com.realestatemarket.salesservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallet_topups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTopup {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "wallet_topups_id", updatable = false, nullable = false)
    private UUID walletTopupsId;

    @Column(name = "phone_number", nullable = false, length = 10)
    private String phoneNumber;

    @Column(nullable = false)
    private double amount;

    @Column(name = "created_time", nullable = false)
    private LocalDateTime createdTime;

    @Column(length = 50, nullable = false)
    private boolean  status;
}
