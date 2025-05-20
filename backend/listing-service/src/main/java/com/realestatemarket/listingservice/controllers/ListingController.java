// package com.realestatemarket.listingservice.controllers;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// public class ListingController {

//     // @PreAuthorize("hasAuthority('Admin')")
//     @GetMapping("/admin/listing")
//     public ResponseEntity<?> getAdminListings() {
//         // Xử lý yêu cầu cho admin
//         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//         String userId = auth.getName(); 
//         System.out.println("User ID: " + userId); // In ra userId để kiểm tra
//         System.out.println("User Roles: " + auth.getAuthorities()); // In ra các quyền của user để kiểm tra
//         return ResponseEntity.ok("Admin listings");

//     }

//     // @PreAuthorize("hasAuthority('User')")
//     @GetMapping("/user/listing")
//     public ResponseEntity<?> getUserListings() {
//          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//         String userId = auth.getName(); 
//          System.out.println("User ID: " + userId); // In ra userId để kiểm tra
//         System.out.println("User Roles: " + auth.getAuthorities()); 
//         // Xử lý yêu cầu cho user
//         return ResponseEntity.ok("User listings");
//     }
// }
