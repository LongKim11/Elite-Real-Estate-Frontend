// package com.realestatemarket.salesservice.services.payment.gateway;

// import java.util.Map;

// import org.springframework.stereotype.Component;

// import com.realestatemarket.salesservice.response.ApiResponse;

// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class ZaloPayAdapter implements IPaymentGateway {
//     @Override
//     public String createPaymentUrl(long amount, String bankCode, String language, String ipAddress, String userInfor) {
//         return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?";
//     }

//     @Override
//     public  ApiResponse<Map<String, String>> processReturn(Map<String, String> params) {
//         return new ApiResponse<>(true, "Payment return verified", null, null);
//     }

//     @Override
//     public ApiResponse<String> processIPN(Map<String, String> params) {
//         return new ApiResponse<>(true, "IPN processed successfully", null, null);
//     }
// }
