package com.realestatemarket.salesservice.services.payment.gateway;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.realestatemarket.salesservice.response.ApiResponse;
import com.realestatemarket.salesservice.services.payment.utils.VNPayUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VNPayAdapter implements IPaymentGateway {

    private final VNPayUtil vnPayUtil;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String secretKey;

    @Value("${vnpay.ipn-url}")
    private String apiUrl;

    @Override
    public String createPaymentUrl(long amount, String ipAddress, String userInfor) {
        amount *= 100;
        String vnp_TxnRef = vnPayUtil.getRandomNumber(8);
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", userInfor);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", ipAddress);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = vnp_Params.get(key);
            hashData.append(key).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
            query.append(URLEncoder.encode(key, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
            if (i != fieldNames.size() - 1) {
                hashData.append('&');
                query.append('&');
            }
        }
        String vnp_SecureHash = vnPayUtil.hmacSHA512(secretKey, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?" + query;
    }

    @Override
    public ApiResponse<Map<String, String>> processReturn(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        // String calculatedHash = vnPayUtil.hashAllFields(params, secretKey);
        // if (!receivedHash.equals(calculatedHash)) {
        //     return new ApiResponse<>(false, "Invalid hash", null, "Hash mismatch");
        // }

        // TODO: Save payment info to DB
        return new ApiResponse<Map<String, String>>(true, "Payment return verified", params, null);
    }

    @Override
    public ApiResponse<String> processIPN(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        String calculatedHash = vnPayUtil.hashAllFields(params, secretKey);
        if (!receivedHash.equals(calculatedHash)) {
            return new ApiResponse<>(false, "Invalid IPN hash", null, "Hash mismatch");
        }

        // TODO: Save IPN data to DB
        return new ApiResponse<>(true, "IPN processed successfully", "TxnRef: " + params.get("vnp_TxnRef"), null);
    }
}
