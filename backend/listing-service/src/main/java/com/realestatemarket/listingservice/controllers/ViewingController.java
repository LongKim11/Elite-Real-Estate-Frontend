// package com.realestatemarket.listingservice.controllers;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.realestatemarket.listingservice.request.ViewingRequest;
// import com.realestatemarket.listingservice.response.ApiResponse;
// import com.realestatemarket.listingservice.services.ViewingService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/v1/viewings")
// @RequiredArgsConstructor
// public class ViewingController {

//     private final ViewingService viewingService;

//     @PostMapping("/schedule")
//     public ResponseEntity<ApiResponse<String>> scheduleViewing(@RequestBody ViewingRequest viewingRequest) {
//         try {
//             viewingService.scheduleViewing(viewingRequest);
//             ApiResponse<String> response = new ApiResponse<>(true, "Viewing scheduled successfully", null, null);
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             ApiResponse<String> errorResponse = new ApiResponse<>(false, "Failed to schedule viewing", null, e.getMessage());
//             return ResponseEntity.badRequest().body(errorResponse);
//         }
//     }
// }
