package com.realestatemarket.listingservice.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestatemarket.listingservice.command.ListingCommand;
import com.realestatemarket.listingservice.command.ListingCommandManager;
import com.realestatemarket.listingservice.command.UpdateDescriptionCommand;
import com.realestatemarket.listingservice.command.UpdateProjectNameCommand;
import com.realestatemarket.listingservice.command.UpdateTitleCommand;
import com.realestatemarket.listingservice.dto.UserInfor;
import com.realestatemarket.listingservice.entity.Address;
import com.realestatemarket.listingservice.entity.Apartment;
import com.realestatemarket.listingservice.entity.House;
import com.realestatemarket.listingservice.entity.ImageStorage;
import com.realestatemarket.listingservice.entity.Land;
import com.realestatemarket.listingservice.entity.Observer;
import com.realestatemarket.listingservice.entity.Property;
import com.realestatemarket.listingservice.entity.filter.PropertySearchFilter;
import com.realestatemarket.listingservice.observer.event.PropertyUpdateEvent;
import com.realestatemarket.listingservice.repository.ApartmentRepository;
import com.realestatemarket.listingservice.repository.ApartmentSpecs;
import com.realestatemarket.listingservice.repository.HouseRepository;
import com.realestatemarket.listingservice.repository.HouseSpecs;
import com.realestatemarket.listingservice.repository.ImageStorageRepository;
import com.realestatemarket.listingservice.repository.LandRepository;
import com.realestatemarket.listingservice.repository.LandSpecs;
import com.realestatemarket.listingservice.repository.ObserverRepository;
import com.realestatemarket.listingservice.repository.PropertyRepository;
import com.realestatemarket.listingservice.request.PropertyRequest;
import com.realestatemarket.listingservice.request.UpdatePropertyRequest;
import com.realestatemarket.listingservice.response.ApiResponse;
import com.realestatemarket.listingservice.response.PropertyWithTier;
import com.realestatemarket.listingservice.services.factory.PropertyFactoryProvider;
import com.realestatemarket.listingservice.services.flyweight.AddressFlyweightFactory;


@Service
public class PropertyService {
    private final PropertyFactoryProvider factoryProvider;
    private final ApartmentRepository apartmentRepository;
    private final HouseRepository houseRepository;
    private final LandRepository landRepository;
    private final PropertyRepository propertyRepository;
    private final AddressFlyweightFactory addressFlyweightFactory;
    private final ImageStorageService imageStorageService;
    private final ImageStorageRepository imageStorageRepository;
    // private final IPropertyFilterBuilder filterBuilder;
    // private final Observer observer;
    private final ObserverRepository observerRepository;
    private final SendEmailService sendEmailService;
    private final Map<UUID, Property> inMemoryProperties;
    private final ListingCommandManager commandManager;
    private final RestTemplate restTemplate;
    private static final List<String> VALID_POST_TIERS = Arrays.asList("VIP_SILVER", "REGULAR", "VIP_GOLD");



    public PropertyService(PropertyFactoryProvider factoryProvider,
                           ApartmentRepository apartmentRepository,
                           HouseRepository houseRepository,
                           LandRepository landRepository,
                           PropertyRepository propertyRepository,
                           AddressFlyweightFactory addressFlyweightFactory,
                           ImageStorageService imageStorageService,
                           ImageStorageRepository imageStorageRepository,
                        //    IPropertyFilterBuilder filterBuilder,
                        //    Observer observer,
                           ObserverRepository observerRepository,
                           SendEmailService sendEmailService,
                           Map<UUID, Property> inMemoryProperties,
                           ListingCommandManager commandManager,
                           RestTemplate restTemplate
                           ) 
                           {
        this.factoryProvider = factoryProvider;
        this.apartmentRepository = apartmentRepository;
        this.houseRepository = houseRepository;
        this.landRepository = landRepository;
        this.propertyRepository = propertyRepository;
        this.addressFlyweightFactory = addressFlyweightFactory;
        this.imageStorageService = imageStorageService;
        this.imageStorageRepository = imageStorageRepository;
        // this.filterBuilder = filterBuilder;
        // this.observer = observer;
        this.observerRepository = observerRepository;
        this.sendEmailService = sendEmailService;
        this.inMemoryProperties = inMemoryProperties;
        this.commandManager = commandManager;
        this.restTemplate = restTemplate;
    }

    // Create a new property
    @Transactional
    public ApiResponse<Property> createProperty(String propertyType, PropertyRequest propertyRequest, MultipartFile[] files) {
        try {
            // 1. Flyweight Pattern - Check and share Address through Redis cache
            Address existingAddress = addressFlyweightFactory.getAddress(
                    propertyRequest.getAddress().getWard(),
                    propertyRequest.getAddress().getTown(),
                    propertyRequest.getAddress().getProvince()
            );

            // 2. Abstract Factory Pattern - Get the appropriate factory based on property type
            var factory = factoryProvider.getFactory(propertyType);
            if (factory == null) {
                return new ApiResponse<>(false, "Invalid property type: " + propertyType, null, null);
            }

            // 2.1. Create property using the factory
            Property property = factory.createProperty();

            // 2.2. Set property details from the request
            property.setUserId(propertyRequest.getUserId());
            property.setAddress(existingAddress);
            property.setPrice(propertyRequest.getPrice());
            property.setCategory(propertyRequest.getCategory());
            property.setTitle(propertyRequest.getTitle());
            property.setFullAddress(propertyRequest.getFullAddress());
            property.setProjectName(propertyRequest.getProjectName());
            property.setDescription(propertyRequest.getDescription());
            property.setTypeTransaction(propertyRequest.getTypeTransaction());
            property.setSquareMeters(propertyRequest.getSquareMeters());
            property.setLongitude(propertyRequest.getLongitude());
            property.setLatitude(propertyRequest.getLatitude());
            property.setStartTime(propertyRequest.getStartTime());
            property.setExpireTime(propertyRequest.getExpireTime());

            // 3. Template Method Pattern - Create property using the template method
            if (property.createProperty(propertyRequest)) {
                // Save the property to the database
                switch (propertyType.toLowerCase()) {
                    case "apartment" -> {
                        if (property instanceof com.realestatemarket.listingservice.entity.Apartment apartment) {
                            apartment.setNumBedrooms(propertyRequest.getNumBedrooms());
                            apartment.setNumBathrooms(propertyRequest.getNumBathrooms());
                            apartment.setFloor(propertyRequest.getFloor());
                            apartment.setBuildingName(propertyRequest.getBuildingName());
                            apartment.setHasBalcony(propertyRequest.isHasBalcony());
                            apartment.setMaintenanceFee(propertyRequest.getMaintenanceFee());
                            apartment.setParkingAvailability(propertyRequest.isParkingAvailability());
                            apartment = apartmentRepository.save(apartment);
                            apartment.setImages(saveListImage(apartment, files));
                            return new ApiResponse<>(true, "Apartment created successfully", apartment, null);
                        } else {
                            return new ApiResponse<>(false, "Property is not an instance of Apartment", null, null);
                        }
                    }
                    case "house" -> {
                        if (property instanceof com.realestatemarket.listingservice.entity.House house) {
                            house.setNumBedrooms(propertyRequest.getNumBedrooms());
                            house.setNumBathrooms(propertyRequest.getNumBathrooms());
                            house.setNumFloors(propertyRequest.getFloor());
                            house.setHasGarden(propertyRequest.isHasGarden());
                            house.setHasGarage(propertyRequest.isHasGarage());
                            house.setLandArea(propertyRequest.getLandArea());
                            house.setHouseType(propertyRequest.getHouseType());
                            house = houseRepository.save(house);
                            house.setImages(saveListImage(house, files));
                            return new ApiResponse<>(true, "House created successfully", house, null);
                        } else {
                            return new ApiResponse<>(false, "Property is not an instance of House", null, null);
                        }
                    }
                    case "land" -> {
                        if (property instanceof com.realestatemarket.listingservice.entity.Land land) {
                            land.setLandType(propertyRequest.getLandType());
                            land.setZoningType(propertyRequest.getZoningType());
                            land.setRoadFrontage(propertyRequest.getRoadFrontage());
                            land.setLegalStatus(propertyRequest.getLegalStatus());
                            land.setCanBuild(propertyRequest.isCanBuild());
                            land.setLandUsageDuration(propertyRequest.getLandUsageDuration());
                            land = landRepository.save(land);
                            land.setImages(saveListImage(land, files));
                            return new ApiResponse<>(true, "Land created successfully", land, null);
                        } else {
                            return new ApiResponse<>(false, "Property is not an instance of Land", null, null);
                        }
                    }
                    default -> {
                        return new ApiResponse<>(false, "Unsupported property type", null, null);
                    }
                }
            }
            return new ApiResponse<>(false, "Failed to create property", null, null);
        } catch (IOException e) {
            return new ApiResponse<>(false, "An error occurred while creating property", null, e.getMessage());
        }
    }

    // Update property
    @Transactional
    public ApiResponse<Property> updateProperty(UUID propertyId, UpdatePropertyRequest propertyRequest, MultipartFile[] files) {
        Optional<Property> optionalProperty = propertyRepository.findById(propertyId);
        if (optionalProperty.isEmpty()) {
            return new ApiResponse<>(false, "Property not found", null, null);
        }
        Property property = optionalProperty.get();
        // Update property
        property.setPrice(propertyRequest.getPrice());
        property.setTitle(propertyRequest.getTitle());
        property.setFullAddress(propertyRequest.getFullAddress());
        property.setProjectName(propertyRequest.getProjectName());
        property.setDescription(propertyRequest.getDescription());
        property.setTypeTransaction(propertyRequest.getTypeTransaction());
        property.setSquareMeters(propertyRequest.getSquareMeters());
        // Observe property changed
        for (Observer observer : property.getObservers()) {
            observer.setEmailService(sendEmailService);
        }
        // Create an event to notify observers
        PropertyUpdateEvent event = PropertyUpdateEvent.builder()
                .propertyId(property.getPropertyId())
                .propertyTitle(property.getTitle())
                .updateDescription("Property updated successfully")
                .updateTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .changedBy("Admin")
                .updateType(PropertyUpdateEvent.UpdateType.OTHER)
                .build();
        // Notify all observers about the prop
        property.notifyObservers(event);
        inMemoryProperties.remove(propertyId);
        switch (property.getClass().getSimpleName().toLowerCase()) {
            case "apartment" -> {
                Apartment apartment = (Apartment) property;
                apartment.setNumBedrooms(propertyRequest.getNumBedrooms());
                apartment.setNumBathrooms(propertyRequest.getNumBathrooms());
                apartment.setFloor(propertyRequest.getFloor());
                apartment.setBuildingName(propertyRequest.getBuildingName());
                apartment.setHasBalcony(propertyRequest.isHasBalcony());
                apartment.setMaintenanceFee(propertyRequest.getMaintenanceFee());
                apartment.setParkingAvailability(propertyRequest.isParkingAvailability());
                
                // Update images
                // List<ImageStorage> oldImages = new ArrayList<>(apartment.getImages());
                // apartment.getImages().clear();
                // deleteListImage(oldImages);
                // apartment.setImages(saveListImage(apartment, files));
                apartment = apartmentRepository.save(apartment);
                return new ApiResponse<>(true, "Apartment updated successfully", apartment, null);
            }
            
            case "house" -> {
                House house = (House) property;
                house.setNumBedrooms(propertyRequest.getNumBedrooms());
                house.setNumBathrooms(propertyRequest.getNumBathrooms());
                house.setNumFloors(propertyRequest.getFloor());
                house.setHasGarden(propertyRequest.isHasGarden());
                house.setHasGarage(propertyRequest.isHasGarage());
                house.setLandArea(propertyRequest.getLandArea());
                house.setHouseType(propertyRequest.getHouseType());
                
                // Update images
                // List<ImageStorage> oldImages = new ArrayList<>(house.getImages());
                // house.getImages().clear();
                // deleteListImage(oldImages);
                // house.setImages(saveListImage(house, files));
                // saveListImage(property, files);
                house = houseRepository.save(house);
                return new ApiResponse<>(true, "House updated successfully", house, null);
            }
            
            case "land" -> {
                Land land = (Land) property;
                land.setLandType(propertyRequest.getLandType());
                land.setZoningType(propertyRequest.getZoningType());
                land.setRoadFrontage(propertyRequest.getRoadFrontage());
                land.setLegalStatus(propertyRequest.getLegalStatus());
                land.setCanBuild(propertyRequest.isCanBuild());
                land.setLandUsageDuration(propertyRequest.getLandUsageDuration());
                // Update images
                // List<ImageStorage> oldImages = new ArrayList<>(land.getImages());
                // land.getImages().clear();
                // deleteListImage(oldImages);
                // land.setImages(saveListImage(land, files));
                land = landRepository.save(land);
                return new ApiResponse<>(true, "Land updated successfully", land, null);
            }
            
            default -> {
                return new ApiResponse<>(false, "Unsupported property type", null, null);
            }
        }
    }
    
    // Search properties with filters
    public ApiResponse<List<PropertyWithTier>> searchProperties(String transactionType, String province, String district, 
            String ward, String type, double minPrice, double maxPrice, boolean isAdmin, String postTier) {
        try {
            // Validate postTier parameter (null or empty means all tiers)
            if (postTier != null && !postTier.isEmpty() && !VALID_POST_TIERS.contains(postTier)) {
                return new ApiResponse<>(false, "Invalid postTier. Must be one of: " + VALID_POST_TIERS, null, null);
            }

            // Build property search filter
            PropertySearchFilter filter = PropertySearchFilter.builder()
                    .withTransactionType(transactionType)
                    .withProvince(province)
                    .withDistrict(district)
                    .withWard(ward)
                    .withMinPrice(minPrice)
                    .withMaxPrice(maxPrice)
                    .build();

            // Fetch properties based on type
            List<Property> properties = new ArrayList<>();
            if (type == null) {
                properties.addAll(apartmentRepository.findAll(ApartmentSpecs.withFilter(filter, isAdmin)));
                properties.addAll(houseRepository.findAll(HouseSpecs.withFilter(filter, isAdmin)));
                properties.addAll(landRepository.findAll(LandSpecs.withFilter(filter, isAdmin)));
            } else {
                switch (type.toLowerCase()) {
                    case "apartment":
                        properties.addAll(apartmentRepository.findAll(ApartmentSpecs.withFilter(filter, isAdmin)));
                        break;
                    case "house":
                        properties.addAll(houseRepository.findAll(HouseSpecs.withFilter(filter, isAdmin)));
                        break;
                    case "land":
                        properties.addAll(landRepository.findAll(LandSpecs.withFilter(filter, isAdmin)));
                        break;
                    default:
                        return new ApiResponse<>(false, "Unsupported property type", null, null);
                }
            }

            // Fetch payment data
            ResponseEntity<ApiResponse<Object>> response = restTemplate.exchange(
                "http://real-estate-sales:8103/api/v1/post-payments",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Object>>() {}
            );

            Object rawData = response.getBody().getData();
            System.out.println("Response data: " + rawData);

            // Validate payment data format
            if (!(rawData instanceof List)) {
                return new ApiResponse<>(false, "Invalid data format", null, null);
            }

            List<LinkedHashMap<String, Object>> rawList = (List<LinkedHashMap<String, Object>>) rawData;
            List<PropertyWithTier> propertiesWithTiers = new ArrayList<>();

            // Create a map of postId to postTier from payment data
            Map<String, String> postIdToTierMap = rawList.stream()
                .filter(postPayment -> postPayment.get("postId") != null && postPayment.get("postTier") != null)
                .collect(Collectors.toMap(
                    postPayment -> (String) postPayment.get("postId"),
                    postPayment -> (String) postPayment.get("postTier"),
                    (existing, replacement) -> existing 
                ));

            // Log the contents of postIdToTierMap for debugging
            System.out.println("PostId to PostTier Map: " + postIdToTierMap);

            // Match filtered properties with payment tiers
            for (Property property : properties) {
                // Convert property ID to String to match postId format
                String propertyId = property.getPropertyId().toString();
                String tier = postIdToTierMap.get(propertyId);
                // Include property if:
                // - postTier is null/empty (include all tiers)
                // - tier matches the specified postTier
                if (postTier == null || postTier.isEmpty() || (tier != null && tier.equals(postTier))) {
                    System.out.println("Property ID: " + propertyId + ", PostTier: " + (tier != null ? tier : "Undefined"));
                    propertiesWithTiers.add(new PropertyWithTier(property, tier != null ? tier : "Undefined", new UserInfor()));
                }
            }

            return new ApiResponse<>(true, "Properties found", propertiesWithTiers, null);

        } catch (Exception e) {
            return new ApiResponse<>(false, "Error processing request: " + e.getMessage(), null, null);
        }
    }

    // Save image URL to database
    private List<ImageStorage> saveListImage(Property property, MultipartFile[] files) throws IOException {
        List<ImageStorage> imageStorageList = new ArrayList<>();
        if(files != null && files.length > 0) {
            for (MultipartFile file : files) {
                String imageUrl = imageStorageService.uploadImage(file); 
                if (imageUrl != null) {
                    imageStorageList.add(imageStorageService.saveImage(property, imageUrl));
                } 
            }
        } else {
            throw new IllegalArgumentException("No files provided for upload");
        }
        return imageStorageList;
    }

    // Delete image URL from database
    private void deleteListImage(List<ImageStorage> imageStorageList) {
        for (ImageStorage imageStorage : imageStorageList) {
            imageStorageRepository.delete(imageStorage);
            imageStorageService.deleteImage(imageStorage.getImageUrl());
        }
    }

    // Generic method to get property by ID, handling not found case
    private Property getPropertyByIdOrThrow(UUID propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    // Get property by ID
    public ApiResponse<PropertyWithTier> getPropertyById(UUID propertyId, String userInfor) {
        try {
            Property property = getPropertyByIdOrThrow(propertyId);
            UserInfor ownerInfo = null;

            // Gọi API lấy thông tin user từ auth-service
            try {
                ResponseEntity<ApiResponse<Object>> response = restTemplate.exchange(
                    "http://real-estate-auth:8100/api/v1/auth/detail/" + property.getUserId(),
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Object>>() {}
                );

                Object rawData = response.getBody().getData();
                ownerInfo = new ObjectMapper().convertValue(rawData, UserInfor.class);
            } catch (Exception e) {
                System.err.println("Failed to fetch owner info: " + e.getMessage());
                ownerInfo = new UserInfor();
            }

            PropertyWithTier propertyWithTier = new PropertyWithTier(property, "", ownerInfo);

            if (userInfor == null) {
                return new ApiResponse<>(true, "Property loaded successfully", propertyWithTier, "0");
            }

            if (checkIfPropertyIsFavorite(userInfor, propertyId)) {
                return new ApiResponse<>(true, "Property is favorited by the user", propertyWithTier, "1");
            }

            if (checkIfUserIsOwner(userInfor, propertyId)) {
                return new ApiResponse<>(true, "User is the owner of this property", propertyWithTier, "2");
            }

            return new ApiResponse<>(true, "Property loaded successfully", propertyWithTier, "0");

        } catch (Exception e) {
            return new ApiResponse<>(false, "Property not found", null, "-1");
        }
    }

    // Check if the property is favorited by the user through phone number
    private boolean checkIfPropertyIsFavorite(String userInfor, UUID propertyId) {
        return observerRepository.existsByPropertyAndPhone(propertyId, userInfor);
    }

    // Check if the user is the owner of the property
    private boolean checkIfUserIsOwner(String userInfor, UUID propertyId) {
        Property property = propertyRepository.findById(propertyId).orElse(null);
        return property != null && property.getUserId().equals(userInfor);
    }

    // Get favorite properties
    public ApiResponse<List<Property>> getFavoriteProperties(String userInfor) {
        // Get All Favite properties from the database
        List<Observer> observers = observerRepository.findByPhoneNumber(userInfor);
        
        // Check not found case
        if (observers.isEmpty()) {
            return new ApiResponse<List<Property>>(false, "No favorite properties found for this user.", null, null);
        }

        // Get property.getObservers().clear();
        List<Property> favoriteProperties = new ArrayList<>();
        for (Observer observer : observers) {
            favoriteProperties.add(observer.getProperty());
        }
        return new ApiResponse<List<Property>>(true, "Favorite properties loaded successfully", favoriteProperties, null);
    }

    // Get owned properties
    public ApiResponse<List<Property>> getOwnedProperties(String userInfor) {
        List<Property> ownedProperties = propertyRepository.findByUserId(userInfor);
        if (ownedProperties.isEmpty()) 
            return new ApiResponse<List<Property>>(false, "No owned properties found for this user.", null, null);
        return new ApiResponse<List<Property>>(true, "Owned properties loaded successfully", ownedProperties, null);
    }

    // Get property by ID to update it
    public ApiResponse<Property> getPropertyUpdate(UUID propertyId) {
        Property property = getPropertyByIdOrThrow(propertyId);
        // Assuming you only want to add to in-memory cache when property is found
        inMemoryProperties.put(propertyId, property);
        System.out.println(inMemoryProperties.size());
        return new ApiResponse<>(true, "Property loaded successfully", property, null);
    }
    
    // Method to update a property field
    private ApiResponse<Property> updatePropertyField(UUID id, String newValue, String fieldName, ListingCommand command) {
        Property property = inMemoryProperties.get(id);
        if (property == null) {
            return new ApiResponse<>(false, "Property not found", null, "Property with given ID does not exist.");
        }
        // Update property
        switch (fieldName) {
            case "title":
                property.setTitle(newValue);
                break;
            case "description":
                property.setDescription(newValue);
                break;
            case "project":
                property.setProjectName(newValue);
                break;
            default:
                return new ApiResponse<>(false, "Invalid field name", null, "Field name is not recognized.");
        }
        // Update property in in-memory cache
        commandManager.executeCommand(command);
        inMemoryProperties.put(id, property); 
        return new ApiResponse<>(true, fieldName + " updated successfully", property, null);
    }
    
    // Update Title
    public ApiResponse<Property> updateTitle(UUID id, String newTitle) {
        ListingCommand command = new UpdateTitleCommand(inMemoryProperties.get(id), newTitle);
        return updatePropertyField(id, newTitle, "title", command);
    }
    
    // Update Description
    public ApiResponse<Property> updateDescription(UUID id, String newDescription) {
        ListingCommand command = new UpdateDescriptionCommand(inMemoryProperties.get(id), newDescription);
        return updatePropertyField(id, newDescription, "description", command);
    }
    
    // Update Project Name
    public ApiResponse<Property> updateProject(UUID id, String newProject) {
        ListingCommand command = new UpdateProjectNameCommand(inMemoryProperties.get(id), newProject);
        return updatePropertyField(id, newProject, "project", command);
    }

    // Undo action
    public ApiResponse<String> undo() {
        commandManager.undoLast();
        String lastActionInfo = commandManager.getLastActionValue(false);
        if (lastActionInfo == null)
            return new ApiResponse<>(false, "No action to undo", null, "Undo stack is empty.");
        return new ApiResponse<>(true, "Undo successful", lastActionInfo, null);
    }

    // Redo action
    public ApiResponse<String> redo() {
        commandManager.redo();
        String result = commandManager.getLastActionValue(false);
        if (result == null)
            return new ApiResponse<>(false, "No action to redo", null, "Redo stack is empty.");    
        return new ApiResponse<>(true, "Redo successful", result, null);
    }

    // Register observer
    public ApiResponse<String> registerObserver(UUID propertyId, String email, String phoneNumber) {
        Optional<Property> optionalProperty = propertyRepository.findById(propertyId);
        if (optionalProperty.isEmpty()) {
            return new ApiResponse<>(false, "Property not found!", null, null);
        }

        Property property = optionalProperty.get();
        if (property.getUserId().equals(phoneNumber)) {
            return new ApiResponse<>(false, "You cannot register as an observer for your own property.", null, null);
        }
        
        property.addPersistentObserver(email, phoneNumber, sendEmailService);

        propertyRepository.save(property);

        return new ApiResponse<>(true, "Observer registered successfully", null, null);
    }

    // Delete property
    @Transactional
    public ApiResponse<String> deleteProperty(UUID propertyId, String userInfor) {
        Optional<Property> optionalProperty = propertyRepository.findById(propertyId);
        if (optionalProperty.isEmpty()) {
            return new ApiResponse<>(false, "Property not found", null, null);
        }

        Property property = optionalProperty.get();

        // Check if the user is the owner
        // if (!checkIfUserIsOwner(userInfor, propertyId)) {
        //     return new ApiResponse<>(false, "User is not authorized to delete this property", null, null);
        // }

        try {
            // Remove all observers
            List<Observer> observers = observerRepository.findByPropertyId(propertyId);
            if (!observers.isEmpty()) {
                observerRepository.deleteAll(observers);
            }

            // Delete the property and its images from the appropriate repository
            switch (property.getClass().getSimpleName().toLowerCase()) {
                case "apartment" -> {
                    Apartment apartment = (Apartment) property;
                    List<ImageStorage> apartmentImages = apartment.getImages();
                    if (apartmentImages != null && !apartmentImages.isEmpty()) {
                        deleteListImage(apartmentImages);
                        apartment.getImages().clear();
                    }
                    apartmentRepository.delete(apartment);
                }
                case "house" -> {
                    House house = (House) property;
                    List<ImageStorage> houseImages = house.getImages();
                    if (houseImages != null && !houseImages.isEmpty()) {
                        deleteListImage(houseImages);
                        house.getImages().clear();
                    }
                    houseRepository.delete(house);
                }
                case "land" -> {
                    Land land = (Land) property;
                    List<ImageStorage> landImages = land.getImages();
                    if (landImages != null && !landImages.isEmpty()) {
                        deleteListImage(landImages);
                        land.getImages().clear();
                    }
                    landRepository.delete(land);
                }
                default -> {
                    return new ApiResponse<>(false, "Unsupported property type", null, null);
                }
            }

            return new ApiResponse<>(true, "Property deleted successfully", null, null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "An error occurred while deleting property", null, e.getMessage());
        }
    }


}


