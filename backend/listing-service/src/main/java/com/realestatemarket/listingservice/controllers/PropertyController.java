package com.realestatemarket.listingservice.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.realestatemarket.listingservice.entity.Property;
import com.realestatemarket.listingservice.request.PropertyRequest;
import com.realestatemarket.listingservice.request.UpdatePropertyRequest;
import com.realestatemarket.listingservice.response.ApiResponse;
import com.realestatemarket.listingservice.response.PropertyWithTier;
import com.realestatemarket.listingservice.services.PropertyService;


@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // Create a new property
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Property>> createProperty(
            @RequestParam("propertyType") String propertyType,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart("propertyRequest") String propertyRequestJson,
            @RequestHeader(value = "X-User-Id", required = false) String userInfor
            ) {
            
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            
            PropertyRequest propertyRequest = objectMapper.readValue(propertyRequestJson, PropertyRequest.class);
            propertyRequest.setUserId(userInfor);

            ApiResponse<Property> response = propertyService.createProperty(propertyType, propertyRequest, files);
            if (response.isSuccess())
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Invalid propertyRequest format", null, e.getMessage()));
        }
    }

    // Search properties with filters
    @GetMapping("/search")
    public  ApiResponse<List<PropertyWithTier>> searchProperties(
        @RequestParam(required = false) String transactionType,
        @RequestParam(required = false) String province,
        @RequestParam(required = false) String district,
        @RequestParam(required = false) String ward,
        @RequestParam(required = false) String propertyType,
        @RequestParam(required = false) Optional<Double> minPrice,
        @RequestParam(required = false) Optional<Double> maxPrice,
        @RequestParam(required = false) String postTier)
    {
        // Get the value from Optional or set default value (0.0)
        double minPriceValue = minPrice.orElse(0.0);
        double maxPriceValue = maxPrice.orElse(0.0);

        // Pass the extracted values (double) to the service method
        return propertyService.searchProperties(transactionType, province, district, ward, propertyType, minPriceValue, maxPriceValue, false, postTier);
    }

    @GetMapping("/search-by-admin")
    public ApiResponse<List<PropertyWithTier>> searchPropertiesByAdmin(
        @RequestParam(required = false) String transactionType,
        @RequestParam(required = false) String province,
        @RequestParam(required = false) String district,
        @RequestParam(required = false) String ward,
        @RequestParam(required = false) String propertyType,
        @RequestParam(required = false) Optional<Double> minPrice,
        @RequestParam(required = false) Optional<Double> maxPrice,
        @RequestParam(required = false) String postTier
        ) 
    {
        // Get the value from Optional or set default value (0.0)
        double minPriceValue = minPrice.orElse(0.0);
        double maxPriceValue = maxPrice.orElse(0.0);

        // Pass the extracted values (double) to the service method
        return propertyService.searchProperties(transactionType, province, district, ward, propertyType, minPriceValue, maxPriceValue, true, postTier);
    }

    // Update a property
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Property>> updateProperty(
            @RequestParam("propertyId") UUID propertyId,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart("propertyRequest") String propertyRequestJson
            ) {
            
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            
            UpdatePropertyRequest propertyRequest = objectMapper.readValue(propertyRequestJson, UpdatePropertyRequest.class);

            ApiResponse<Property> response = propertyService.updateProperty(propertyId, propertyRequest, files);
            if (response.isSuccess())
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Invalid propertyRequest format", null, e.getMessage()));
        }
    }

    @DeleteMapping("/{propertyId}")
    public ApiResponse<String> deleteProperty(@PathVariable UUID propertyId, @RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        return propertyService.deleteProperty(propertyId, userInfor);
    }


    // Register observer
    @PostMapping("/{propertyId}/registerObserver")
    public ApiResponse<String> registerObserver(
            @PathVariable UUID propertyId, 
            @RequestParam String email,
            @RequestHeader(value = "X-User-Id", required = false) String userInfor
            ) {
        return propertyService.registerObserver(propertyId, email, userInfor);
    }

    @GetMapping("/details/{propertyId}")
    public ApiResponse<PropertyWithTier> getPropertyDetail(
            @PathVariable UUID propertyId,
            @RequestHeader(value = "X-User-Id", required = false) String userInfor
            ) {

        return propertyService.getPropertyById(propertyId, userInfor);
    }

    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<Property>>> getFavoriteProperties(@RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        ApiResponse<List<Property>> response = propertyService.getFavoriteProperties(userInfor);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // API lấy các bài viết người dùng sở hữu
    @GetMapping("/owned")
    public ResponseEntity<ApiResponse<List<Property>>> getOwnedProperties(@RequestHeader(value = "X-User-Id", required = false) String userInfor) {
        ApiResponse<List<Property>> response = propertyService.getOwnedProperties(userInfor);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
