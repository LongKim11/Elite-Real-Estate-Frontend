package com.realestatemarket.salesservice.services.payment.gateway;

import org.springframework.stereotype.Component;

import com.realestatemarket.salesservice.services.payment.utils.VNPayUtil;

@Component
public class PaymentGatewayFactory {

    private final VNPayUtil vnPayUtil;

    public PaymentGatewayFactory(VNPayUtil vnPayUtil) {
        this.vnPayUtil = vnPayUtil;
    }

    public IPaymentGateway getPaymentGateway(String gatewayType) {
        switch (gatewayType) {
            case "VNPay" -> {
                return new VNPayAdapter(vnPayUtil);
            }
            // case "ZaloPay" -> {
            //     return new ZaloPayAdapter();
            // }
            default -> throw new IllegalArgumentException("Unknown payment gateway: " + gatewayType);
        }
    }
}
