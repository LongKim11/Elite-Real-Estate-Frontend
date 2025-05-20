package com.realestatemarket.salesservice.services.payment.gateway;

import java.util.Map;

import com.realestatemarket.salesservice.response.ApiResponse;

public interface IPaymentGateway {
    String createPaymentUrl(long amount, String ipAddress,  String userInfor);
    ApiResponse<Map<String, String>> processReturn(Map<String, String> params);
    ApiResponse<String> processIPN(Map<String, String> params);
}