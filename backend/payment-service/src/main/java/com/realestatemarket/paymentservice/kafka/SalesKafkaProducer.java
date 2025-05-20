package com.realestatemarket.paymentservice.kafka;


import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.realestatemarket.paymentservice.request.TransactionRequest;

@Service
public class SalesKafkaProducer {

    private final KafkaTemplate<String, TransactionRequest> kafkaTemplate;

    public SalesKafkaProducer(KafkaTemplate<String, TransactionRequest> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTransaction(TransactionRequest transactionRequest) {
        try {            
            kafkaTemplate.send("transaction-topic", transactionRequest);
        } catch (Exception e) {
            System.out.println("Error sending transaction: " + transactionRequest + " | Error: " + e.getMessage());
        }
    }
}