package com.realestatemarket.listingservice.entity;

import com.realestatemarket.listingservice.services.flyweight.Flyweight;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
public class Address implements Flyweight {

    @Id
    @Column(name = "address_id", updatable = false, nullable = false)
    private String addressId;
    private String ward;
    private String town;
    private String province;
}
