package com.realestatemarket.listingservice.repository;


import com.realestatemarket.listingservice.entity.Property;
import com.realestatemarket.listingservice.entity.filter.PropertySearchFilter;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;

public class PropertySpecs {

    public static Specification<Property> withFilter(PropertySearchFilter filter) {

        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();
            if (filter.getTransactionType() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("typeTransaction"), filter.getTransactionType()));
            }

            if (filter.getProvince() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("address").get("province"), filter.getProvince()));
            }

            if (filter.getDistrict() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("address").get("town"), filter.getDistrict().trim()));
            }

            if (filter.getWard() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("address").get("ward"), filter.getWard()));
            }

            return predicate;
        };
    }
}
