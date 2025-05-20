package com.realestatemarket.listingservice.entity.filter;

import lombok.Getter;

@Getter
public class PropertySearchFilter {
    private final String transactionType;
    private final String province;
    private final String district;
    private final String ward;
    private final double minPrice;
    private final double maxPrice;

    private PropertySearchFilter(Builder builder) {
        this.transactionType = builder.transactionType;
        this.province = builder.province;
        this.district = builder.district;
        this.ward = builder.ward;
        this.minPrice = builder.minPrice;
        this.maxPrice = builder.maxPrice;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String transactionType;
        private String province;
        private String district;
        private String ward;
        private double minPrice;
        private double maxPrice;

        public Builder withTransactionType(String transactionType) {
            this.transactionType = transactionType;
            return this;
        }

        public Builder withProvince(String province) {
            this.province = province;
            return this;
        }

        public Builder withDistrict(String district) {
            this.district = district;
            return this;
        }

        public Builder withWard(String ward) {
            this.ward = ward;
            return this;
        }

        public Builder withMinPrice(double minPrice) {
            this.minPrice = minPrice;
            return this;
        }

        public Builder withMaxPrice(double maxPrice) {
            this.maxPrice = maxPrice;
            return this;
        }

        public PropertySearchFilter build() {
            return new PropertySearchFilter(this);
        }
    }
}
