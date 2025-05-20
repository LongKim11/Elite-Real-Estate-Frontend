package com.realestatemarket.listingservice.repository;


import java.util.Date;

import org.springframework.data.jpa.domain.Specification;

import com.realestatemarket.listingservice.entity.House;
import com.realestatemarket.listingservice.entity.ImageStorage;
import com.realestatemarket.listingservice.entity.filter.PropertySearchFilter;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class HouseSpecs {

    public static Specification<House> withFilter(PropertySearchFilter filter, boolean isAdmin) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            // Điều kiện TransactionType
            if (filter.getTransactionType() != null && !filter.getTransactionType().isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("typeTransaction"), filter.getTransactionType()));
            }

            // Điều kiện Province
            if (filter.getProvince() != null && !filter.getProvince().isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("address").get("province"), filter.getProvince()));
            }

            // Điều kiện District
            if (filter.getDistrict() != null && !filter.getDistrict().isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("address").get("town"), filter.getDistrict().trim()));
            }

            // Điều kiện Ward
            if (filter.getWard() != null && !filter.getWard().isEmpty()) {
                predicate = cb.and(predicate, cb.equal(root.get("address").get("ward"), filter.getWard()));
            }

            if (!isAdmin) {
                Date today = new Date();
                Predicate expirePredicate = cb.greaterThanOrEqualTo(root.get("expireTime"), today);
                predicate = cb.and(predicate, expirePredicate);
            }

            // Điều kiện MinPrice và MaxPrice
            if (filter.getMinPrice() > 0) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }

            if (filter.getMaxPrice() > 0) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            // Fetch images with left join
            Join<House, ImageStorage> imageJoin = root.join("images", JoinType.LEFT);
            
            // Only select the imageUrl field from the ImageStorage
            Expression<String> imageUrlExpression = imageJoin.get("imageUrl");

            // Ensure that the imageUrl is not null or empty
            query.distinct(true); 

            // Add the imageUrl to the select clause
            query.multiselect(root, imageUrlExpression); 
            
            return predicate;

        };
    }
}
