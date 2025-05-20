// package com.realestatemarket.authenticationservice.rest;

// import org.springframework.kafka.core.KafkaTemplate;
// import org.springframework.stereotype.Service;

// @Service
// public class AuthKafkaProducer {

//     private final KafkaTemplate<String, String> kafkaTemplate;

//     public AuthKafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
//         this.kafkaTemplate = kafkaTemplate;
//     }

//     public void sendUserId(String userId) {
//         kafkaTemplate.send("user-topic", userId);  // Send userId to Kafka topic "user-topic"
//     }
// }