package com.realestatemarket.listingservice.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    private String ward;    
    private String town;
    private String province;
}
