package com.realestatemarket.listingservice.builder;

import com.realestatemarket.listingservice.entity.filter.PropertySearchFilter;

public interface IPropertyFilterBuilder {
    IPropertyFilterBuilder withTransactionType(String type);
    IPropertyFilterBuilder withProvince(String province);
    IPropertyFilterBuilder withDistrict(String district);
    IPropertyFilterBuilder withWard(String ward);
    IPropertyFilterBuilder withMinPrice(double minPrice);
    IPropertyFilterBuilder withMaxPrice(double maxPrice);

    PropertySearchFilter build();
}
