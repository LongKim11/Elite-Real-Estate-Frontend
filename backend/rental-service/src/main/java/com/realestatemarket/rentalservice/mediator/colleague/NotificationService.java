// package com.realestatemarket.rentalservice.mediator.colleague;

// import com.realestatemarket.rentalservice.enums.EventType;
// import com.realestatemarket.rentalservice.mediator.mediator.Mediator;

// public class NotificationService implements Colleague {
//     public NotificationService(Mediator mediator) {
//         mediator.register(this, EventType.VIEWING_SCHEDULED);
//     }

//     @Override
//     public void handle(EventType eventType, Object payload) {
//         if (eventType == EventType.VIEWING_SCHEDULED) {
//             System.out.println("NotificationService: Gửi email thông báo lịch xem nhà - " + payload);
//         }
//     }
// }