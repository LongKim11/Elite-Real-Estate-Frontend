// package com.realestatemarket.listingservice.services;

// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Service;

// @Service
// public class PostKafkaConsumer {

//     @KafkaListener(topics = "user-topic", groupId = "my-group")
//     public void consumeUserId(String userId) {
//         System.out.println("Received userId from Kafka: " + userId);
//         // Process the userId (e.g., save to DB or create a post)
//     }
// }
