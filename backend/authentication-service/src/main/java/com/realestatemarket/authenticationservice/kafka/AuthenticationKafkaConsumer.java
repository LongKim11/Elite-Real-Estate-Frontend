package com.realestatemarket.authenticationservice.kafka;

import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestatemarket.authenticationservice.dao.UserRepository;
import com.realestatemarket.authenticationservice.request.TransactionRequest.TransactionType;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AuthenticationKafkaConsumer {
    private final UserRepository repository;
    public AuthenticationKafkaConsumer(UserRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(topics = "transaction-topic", groupId = "real-estate-group")
    public void consumeTransaction(String message) {
        try {
            // Deserialize the message into a TransactionRequest object
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Map<String, Object> map = mapper.readValue(message, Map.class);

            String userId = (String) map.get("userId");
            Double amount = ((Number) map.get("amount")).doubleValue();
            TransactionType type = TransactionType.valueOf((String) map.get("type"));


            var user = repository.findByPhone(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found for phone: " + userId));

            switch (type) {
                case TransactionType.DEPOSIT -> user.setAccountBalance(user.getAccountBalance() + amount);
                case TransactionType.WITHDRAWAL -> user.setAccountBalance(user.getAccountBalance() - amount);
                default -> throw new IllegalArgumentException("Unsupported transaction type: " + type);
            }
            repository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process transaction", e);
        }
    }
}