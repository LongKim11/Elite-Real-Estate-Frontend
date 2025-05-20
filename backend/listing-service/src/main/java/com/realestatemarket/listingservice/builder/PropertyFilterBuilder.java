package com.realestatemarket.listingservice.builder;

import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.entity.filter.PropertySearchFilter;

@Component
public class PropertyFilterBuilder implements IPropertyFilterBuilder {
    private String transactionType;
    private String province;
    private String district;
    private String ward;
    private double minPrice;
    private double maxPrice;

    @Override
    public IPropertyFilterBuilder withTransactionType(String type) {
        this.transactionType = type;
        return this;
    }

    @Override
    public IPropertyFilterBuilder withProvince(String province) {
        this.province = province;
        return this;
    }

    @Override
    public IPropertyFilterBuilder withDistrict(String district) {
        this.district = district;
        return this;
    }

    @Override
    public IPropertyFilterBuilder withWard(String ward) {
        this.ward = ward;
        return this;
    }

    @Override
    public IPropertyFilterBuilder withMinPrice(double minPrice) {
        this.minPrice = minPrice;
        return this;
    }

    @Override
    public IPropertyFilterBuilder withMaxPrice(double maxPrice) {
        this.maxPrice = maxPrice;
        return this;
    }

    @Override
    public PropertySearchFilter build() {
        PropertySearchFilter filter = PropertySearchFilter.builder()
            .withTransactionType(transactionType)
            .withProvince(province)
            .withDistrict(district)
            .withWard(ward)
            .withMinPrice(minPrice)
            .withMaxPrice(maxPrice)
            .build();

        reset(); 
        return filter;
    }

    private void reset() {
        this.transactionType = null;
        this.province = null;
        this.district = null;
        this.ward = null;
        this.minPrice = 0;
        this.maxPrice = 0;
    }
}
