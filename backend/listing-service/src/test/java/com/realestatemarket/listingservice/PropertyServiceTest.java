package com.realestatemarket.listingservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestatemarket.listingservice.command.ListingCommandManager;
import com.realestatemarket.listingservice.dto.UserInfor;
import com.realestatemarket.listingservice.entity.*;
import com.realestatemarket.listingservice.entity.filter.PropertySearchFilter;
import com.realestatemarket.listingservice.repository.*;
import com.realestatemarket.listingservice.request.AddressRequest;
import com.realestatemarket.listingservice.request.PropertyRequest;
import com.realestatemarket.listingservice.request.UpdatePropertyRequest;
import com.realestatemarket.listingservice.response.ApiResponse;
import com.realestatemarket.listingservice.response.PropertyWithTier;
import com.realestatemarket.listingservice.services.factory.PropertyFactory;
import com.realestatemarket.listingservice.services.factory.PropertyFactoryProvider;
import com.realestatemarket.listingservice.services.flyweight.AddressFlyweightFactory;
import com.realestatemarket.listingservice.services.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyFactoryProvider factoryProvider;

    @Mock
    private ApartmentRepository apartmentRepository;

    @Mock
    private HouseRepository houseRepository;

    @Mock
    private LandRepository landRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private AddressFlyweightFactory addressFlyweightFactory;

    @Mock
    private ImageStorageService imageStorageService;

    @Mock
    private ImageStorageRepository imageStorageRepository;

    @Mock
    private ObserverRepository observerRepository;

    @Mock
    private SendEmailService sendEmailService;

    @Mock
    private ListingCommandManager commandManager;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private PropertyFactory propertyFactory;

    @Mock
    private Apartment mockedApartment; // Mocked Apartment instance

    @InjectMocks
    private PropertyService propertyService;

    private PropertyRequest propertyRequest;
    private UpdatePropertyRequest updatePropertyRequest;
    private Address address;
    private MultipartFile[] files;
    private UUID propertyId;

    @BeforeEach
    void setUp() {
        propertyId = UUID.randomUUID();
        address = new Address();
        address.setWard("Ward1");
        address.setTown("Town1");
        address.setProvince("Province1");
        address.setAddressId("address1");

        propertyRequest = new PropertyRequest();
        propertyRequest.setUserId("user123");
        propertyRequest.setAddress(new AddressRequest());
        propertyRequest.getAddress().setWard("Ward1");
        propertyRequest.getAddress().setTown("Town1");
        propertyRequest.getAddress().setProvince("Province1");
        propertyRequest.setPrice(1000000.0);
        propertyRequest.setTitle("Test Apartment");
        propertyRequest.setNumBedrooms(2);
        propertyRequest.setNumBathrooms(1);
        propertyRequest.setFloor(5);
        propertyRequest.setBuildingName("Test Building");
        propertyRequest.setMaintenanceFee(500.0);
        propertyRequest.setCategory("residential");
        propertyRequest.setTypeTransaction("sale");
        propertyRequest.setLongitude("123.456");
        propertyRequest.setLatitude("78.910");
        propertyRequest.setProjectName("Test Project");
        propertyRequest.setFullAddress("123 Test St");
        propertyRequest.setSquareMeters(80.0);
        propertyRequest.setDescription("A nice apartment");
        propertyRequest.setStartTime(LocalDateTime.now());
        propertyRequest.setExpireTime(LocalDateTime.now().plusDays(30));

        updatePropertyRequest = new UpdatePropertyRequest();
        updatePropertyRequest.setPrice(1200000.0);
        updatePropertyRequest.setTitle("Updated Apartment");
        updatePropertyRequest.setNumBedrooms(3);

        files = new MultipartFile[]{mock(MultipartFile.class)};
    }

    @Test
    void createProperty_Apartment_Success() throws IOException {
        // Arrange
        when(addressFlyweightFactory.getAddress(anyString(), anyString(), anyString())).thenReturn(address);
        when(factoryProvider.getFactory("apartment")).thenReturn(propertyFactory);
        when(propertyFactory.createProperty()).thenReturn(mockedApartment);
        doAnswer(invocation -> true).when(mockedApartment).createProperty(any(PropertyRequest.class));
        when(apartmentRepository.save(any(Apartment.class))).thenReturn(mockedApartment);
        when(imageStorageService.uploadImage(any(MultipartFile.class))).thenReturn("image-url");
        when(imageStorageService.saveImage(any(Property.class), anyString())).thenReturn(new ImageStorage());

        // Act
        ApiResponse<Property> response = propertyService.createProperty("apartment", propertyRequest, files);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Apartment created successfully", response.getMessage());
        assertNotNull(response.getData());
        verify(apartmentRepository).save(any(Apartment.class));
        verify(imageStorageService).uploadImage(any(MultipartFile.class));
    }

    @Test
    void createProperty_InvalidPropertyType_Failure() {
        // Act
        ApiResponse<Property> response = propertyService.createProperty("invalid", propertyRequest, files);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid property type: invalid", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void createProperty_IOException_Failure() throws IOException {
        // Arrange
        when(addressFlyweightFactory.getAddress(anyString(), anyString(), anyString())).thenReturn(address);
        when(factoryProvider.getFactory("apartment")).thenReturn(propertyFactory);
        when(propertyFactory.createProperty()).thenReturn(mockedApartment);
        doAnswer(invocation -> true).when(mockedApartment).createProperty(any(PropertyRequest.class));
        when(imageStorageService.uploadImage(any(MultipartFile.class))).thenThrow(new IOException("Upload failed"));

        // Act
        ApiResponse<Property> response = propertyService.createProperty("apartment", propertyRequest, files);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("An error occurred while creating property", response.getMessage());
        assertNull(response.getData());
    }


    @Test
    void updateProperty_NotFound_Failure() {
        // Arrange
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<Property> response = propertyService.updateProperty(propertyId, updatePropertyRequest, files);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Property not found", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void searchProperties_Apartment_Success() {
        // Arrange
        List<Apartment> apartments = List.of(mockedApartment);
        when(apartmentRepository.findAll(any(Specification.class))).thenReturn(apartments);
        when(mockedApartment.getPropertyId()).thenReturn(propertyId);

        ApiResponse<Object> paymentResponse = new ApiResponse<>(true, "Success", List.of(
                new LinkedHashMap<String, Object>() {{
                    put("postId", propertyId.toString());
                    put("postTier", "VIP_SILVER");
                }}
        ), null);
        when(restTemplate.exchange(
                eq("http://real-estate-sales:8103/api/v1/post-payments"),
                eq(HttpMethod.GET),
                eq(null),
                any(ParameterizedTypeReference.class)
        )).thenReturn(ResponseEntity.ok(paymentResponse));

        // Act
        ApiResponse<List<PropertyWithTier>> response = propertyService.searchProperties(
                "sale", "Province1", null, null, "apartment", 0, 2000000, false, "VIP_SILVER"
        );

        // Assert
        assertTrue(response.isSuccess(), "Expected success but got: " + response.getMessage());
        assertEquals("Properties found", response.getMessage());
        assertEquals(1, response.getData().size());
        assertEquals("VIP_SILVER", response.getData().get(0).getPostTier());
    }

    @Test
    void searchProperties_InvalidPostTier_Failure() {
        // Act
        ApiResponse<List<PropertyWithTier>> response = propertyService.searchProperties(
                "sale", "Province1", null, null, "apartment", 0, 2000000, false, "INVALID_TIER"
        );

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid postTier. Must be one of: [VIP_SILVER, REGULAR, VIP_GOLD]", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void deleteProperty_Apartment_Success() {
        // Arrange
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(mockedApartment));
        when(observerRepository.findByPropertyId(propertyId)).thenReturn(List.of());

        // Act
        ApiResponse<String> response = propertyService.deleteProperty(propertyId, "user123");

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Property deleted successfully", response.getMessage());
        verify(apartmentRepository).delete(mockedApartment);
    }

    @Test
    void deleteProperty_NotFound_Failure() {
        // Arrange
        when(propertyRepository.findById(propertyId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<String> response = propertyService.deleteProperty(propertyId, "user123");

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Property not found", response.getMessage());
        assertNull(response.getData());
    }
}