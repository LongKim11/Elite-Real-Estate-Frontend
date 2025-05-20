package com.realestatemarket.listingservice.entity;

import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "image_storage")
@Getter
@Setter
@NoArgsConstructor
public class ImageStorage {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "storage_id", updatable = false, nullable = false)
    private UUID storageId;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    private String imageUrl;
}