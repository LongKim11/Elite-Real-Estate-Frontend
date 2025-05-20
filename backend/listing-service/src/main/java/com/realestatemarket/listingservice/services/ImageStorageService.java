package com.realestatemarket.listingservice.services;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.realestatemarket.listingservice.entity.ImageStorage;
import com.realestatemarket.listingservice.entity.Property;
import com.realestatemarket.listingservice.repository.ImageStorageRepository;

@Service
public class ImageStorageService {

    @Value("${supabase.base.url}")
    private String supabaseBaseUrl;

    @Value("${supabase.api.key}")
    private String supabaseApiKey;

    @Value("${supabase.bucket.name}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    private final ImageStorageRepository imageStorageRepository;

    public ImageStorageService(ImageStorageRepository imageStorageRepository) {
        this.imageStorageRepository = imageStorageRepository;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        try {
            // Create unique file name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadPath = "properties/" + fileName;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(supabaseApiKey);
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            String uploadUrl = supabaseBaseUrl + "/object/" + bucketName + "/" + uploadPath;

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.PUT,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return supabaseBaseUrl + "/object/public/" + bucketName + "/" + uploadPath;
            } else {
                throw new IOException("Failed to upload image: " + file.getOriginalFilename());
            }

        } catch (IOException e) {
            throw new RuntimeException("Error uploading image: " + e.getMessage());
        }
    }

    public ImageStorage saveImage(Property property, String imageUrl) {
        ImageStorage imageStorage = new ImageStorage();
        imageStorage.setProperty(property);
        imageStorage.setImageUrl(imageUrl);
        return imageStorageRepository.save(imageStorage);
    }

    public void deleteImage(String imageUrl) {
        String normalizedUrl = imageUrl.replaceAll("(?<!:)//+", "/");
        String[] parts = normalizedUrl.split("/storage/v1/object/public/" + bucketName + "/");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid Supabase image URL format");
        }
        
        String filePath = URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
        
        String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
            supabaseBaseUrl.replaceAll("/$", ""),
            bucketName,
            filePath);
        deleteUrl = deleteUrl.replaceFirst("/storage/v1", "");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(supabaseApiKey);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
    
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                deleteUrl,
                HttpMethod.DELETE,
                requestEntity,
                String.class
            );
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Delete failed. Status: " + response.getStatusCode() + 
                                       ", Response: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage(), e);
        }
    }

    public List<ImageStorage> saveListImage(Property property, MultipartFile[] files) throws IOException {
        List<ImageStorage> imageStorageList = new ArrayList<>();
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                String imageUrl = uploadImage(file);
                if (imageUrl != null) {
                    imageStorageList.add(saveImage(property, imageUrl));
                }
            }
        } else {
            throw new IllegalArgumentException("No files provided for upload");
        }
        return imageStorageList;
    }
}
