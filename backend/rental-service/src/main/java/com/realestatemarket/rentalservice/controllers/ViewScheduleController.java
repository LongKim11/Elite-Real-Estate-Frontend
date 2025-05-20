package com.realestatemarket.rentalservice.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestatemarket.rentalservice.request.UpdateViewingRequest;
import com.realestatemarket.rentalservice.request.ViewingRequest;
import com.realestatemarket.rentalservice.response.ApiResponse;
import com.realestatemarket.rentalservice.services.ViewingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/view-schedule")
@RequiredArgsConstructor
public class ViewScheduleController {

    private final ViewingService viewingService;

    // Create a new viewing appointment
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createViewing(@RequestBody ViewingRequest request) {
        ApiResponse<String> response = viewingService.scheduleViewing(request);
        return ResponseEntity.ok(response);
    }

    // Get all viewings
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllViewings() {
        ApiResponse<?> response = viewingService.getAllViewings();
        return ResponseEntity.ok(response);
    }

    // Get all viewings for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<?>> getViewingsByProperty(@PathVariable UUID propertyId) {
        ApiResponse<?> response = viewingService.getViewingsByProperty(propertyId);
        return ResponseEntity.ok(response);
    }

    // Get details of a specific viewing
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getViewingById(@PathVariable UUID id) {
        ApiResponse<?> response = viewingService.getViewingById(id);
        return ResponseEntity.ok(response);
    }

    // Update the viewing (reschedule)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateViewing(@PathVariable UUID id, @RequestBody UpdateViewingRequest request) {
        ApiResponse<String> response = viewingService.updateViewing(id, request);
        return ResponseEntity.ok(response);
    }

    // Cancel the viewing
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelViewing(@PathVariable UUID id) {
        ApiResponse<String> response = viewingService.cancelViewing(id);
        return ResponseEntity.ok(response);
    }

    // Delete the viewing
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteViewing(@PathVariable UUID id) {
        ApiResponse<String> response = viewingService.deleteViewing(id);
        return ResponseEntity.ok(response);
    }

    // Confirm the viewing
    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<String>> confirmViewing(@PathVariable UUID id) {
        ApiResponse<String> response = viewingService.confirmViewing(id);
        return ResponseEntity.ok(response);
    }

    // Mark the viewing as completed
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<String>> completeViewing(@PathVariable UUID id) {
        ApiResponse<String> response = viewingService.completeViewing(id);
        return ResponseEntity.ok(response);
    }
}
