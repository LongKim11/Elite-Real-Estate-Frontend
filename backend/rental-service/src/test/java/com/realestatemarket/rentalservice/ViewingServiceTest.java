package com.realestatemarket.rentalservice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.mediator.colleague.Buyer;
import com.realestatemarket.rentalservice.mediator.colleague.Seller;
import com.realestatemarket.rentalservice.mediator.command.CancelViewingCommand;
import com.realestatemarket.rentalservice.mediator.command.CompleteViewingCommand;
import com.realestatemarket.rentalservice.mediator.command.ConfirmViewingCommand;
import com.realestatemarket.rentalservice.mediator.command.ScheduleViewingCommand;
import com.realestatemarket.rentalservice.mediator.command.UpdateViewingCommand;
import com.realestatemarket.rentalservice.mediator.handler.CancelViewingHandler;
import com.realestatemarket.rentalservice.mediator.handler.CompleteViewingHandler;
import com.realestatemarket.rentalservice.mediator.handler.ConfirmViewingHandler;
import com.realestatemarket.rentalservice.mediator.handler.ScheduleViewingHandler;
import com.realestatemarket.rentalservice.mediator.handler.UpdateViewingHandler;
import com.realestatemarket.rentalservice.repository.ViewingRepository;
import com.realestatemarket.rentalservice.request.UpdateViewingRequest;
import com.realestatemarket.rentalservice.request.ViewingRequest;
import com.realestatemarket.rentalservice.response.ApiResponse;
import com.realestatemarket.rentalservice.services.ViewingService;

@ExtendWith(MockitoExtension.class)
class ViewingServiceTest {

    @Mock
    private ScheduleViewingHandler scheduleViewingHandler;

    @Mock
    private UpdateViewingHandler updateViewingHandler;

    @Mock
    private CancelViewingHandler cancelViewingHandler;

    @Mock
    private ConfirmViewingHandler confirmViewingHandler;

    @Mock
    private CompleteViewingHandler completeViewingHandler;

    @Mock
    private ViewingRepository viewingRepository;

    @Mock
    private Buyer buyer;

    @Mock
    private Seller seller;

    @InjectMocks
    private ViewingService viewingService;

    private Viewing viewing;
    private UUID viewingId;
    private ViewingRequest viewingRequest;
    private UpdateViewingRequest updateViewingRequest;

    @BeforeEach
    void setUp() {
        viewingId = UUID.randomUUID();
        viewing = new Viewing();
        viewing.setId(viewingId);
        viewing.setPropertyId(UUID.randomUUID());
        viewing.setScheduledAt(LocalDateTime.now());
        viewing.setViewNotes("Test notes");
        viewing.setViewerEmail("viewer@example.com");
        viewing.setViewerName("Viewer Name");
        viewing.setViewerPhone("1234567890");

        viewingRequest = new ViewingRequest();
        viewingRequest.setPropertyId(UUID.randomUUID());
        viewingRequest.setScheduledAt(LocalDateTime.now());
        viewingRequest.setViewNotes("Test notes");
        viewingRequest.setViewerEmail("viewer@example.com");
        viewingRequest.setViewerName("Viewer Name");
        viewingRequest.setViewerPhone("1234567890");

        updateViewingRequest = new UpdateViewingRequest();
    }

    @Test
    void scheduleViewing_Success() {
        // Arrange
        doNothing().when(scheduleViewingHandler).handle(any(ScheduleViewingCommand.class));
        doNothing().when(buyer).scheduleViewing(any(ViewingRequest.class));

        // Act
        ApiResponse<String> result = viewingService.scheduleViewing(viewingRequest);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing scheduled successfully", result.getMessage());
        assertNull(result.getData());
        verify(scheduleViewingHandler).handle(any(ScheduleViewingCommand.class));
        verify(buyer).scheduleViewing(viewingRequest);
    }

    @Test
    void getAllViewings_Success() {
        // Arrange
        List<Viewing> viewings = List.of(viewing);
        when(viewingRepository.findAll()).thenReturn(viewings);

        // Act
        ApiResponse<List<Viewing>> result = viewingService.getAllViewings();

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("List of viewings", result.getMessage());
        assertEquals(viewings, result.getData());
        verify(viewingRepository).findAll();
    }

    @Test
    void getViewingsByProperty_Success() {
        // Arrange
        UUID propertyId = UUID.randomUUID();
        List<Viewing> viewings = List.of(viewing);
        when(viewingRepository.findByPropertyId(propertyId)).thenReturn(viewings);

        // Act
        ApiResponse<List<Viewing>> result = viewingService.getViewingsByProperty(propertyId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("List of viewings", result.getMessage());
        assertEquals(viewings, result.getData());
        verify(viewingRepository).findByPropertyId(propertyId);
    }

    @Test
    void deleteViewing_Success() {
        // Arrange
        doNothing().when(viewingRepository).deleteById(viewingId);

        // Act
        ApiResponse<String> result = viewingService.deleteViewing(viewingId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing deleted successfully", result.getMessage());
        assertNull(result.getData());
        verify(viewingRepository).deleteById(viewingId);
    }

    @Test
    void updateViewing_Success() {
        // Arrange
        doNothing().when(updateViewingHandler).handle(any(UpdateViewingCommand.class));
        when(viewingRepository.findById(viewingId)).thenReturn(Optional.of(viewing));
        doNothing().when(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_RESCHEDULED));

        // Act
        ApiResponse<String> result = viewingService.updateViewing(viewingId, updateViewingRequest);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing updated successfully.", result.getMessage());
        assertNull(result.getData());
        verify(updateViewingHandler).handle(any(UpdateViewingCommand.class));
        verify(viewingRepository).findById(viewingId);
        verify(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_RESCHEDULED));
    }

    @Test
    void getViewingById_Success() {
        // Arrange
        when(viewingRepository.findById(viewingId)).thenReturn(Optional.of(viewing));

        // Act
        ApiResponse<Viewing> result = viewingService.getViewingById(viewingId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing details", result.getMessage());
        assertEquals(viewing, result.getData());
        verify(viewingRepository).findById(viewingId);
    }

    @Test
    void getViewingById_Failure() {
        // Arrange
        when(viewingRepository.findById(viewingId)).thenReturn(Optional.empty());

        // Act
        ApiResponse<Viewing> result = viewingService.getViewingById(viewingId);

        // Assert
        assertFalse(result.isSuccess());
        assertEquals("Viewing not found", result.getMessage());
        assertNull(result.getData());
        assertEquals("The viewing does not exist", result.getError());
        verify(viewingRepository).findById(viewingId);
    }

    @Test
    void cancelViewing_Success() {
        // Arrange
        doNothing().when(cancelViewingHandler).handle(any(CancelViewingCommand.class));
        when(viewingRepository.findById(viewingId)).thenReturn(Optional.of(viewing));
        doNothing().when(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_CANCELLED));

        // Act
        ApiResponse<String> result = viewingService.cancelViewing(viewingId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing cancelled successfully", result.getMessage());
        assertNull(result.getData());
        verify(cancelViewingHandler).handle(any(CancelViewingCommand.class));
        verify(viewingRepository).findById(viewingId);
        verify(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_CANCELLED));
    }

    @Test
    void confirmViewing_Success() {
        // Arrange
        doNothing().when(confirmViewingHandler).handle(any(ConfirmViewingCommand.class));
        when(viewingRepository.findById(viewingId)).thenReturn(Optional.of(viewing));
        doNothing().when(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_CONFIRMED));

        // Act
        ApiResponse<String> result = viewingService.confirmViewing(viewingId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing confirmed successfully", result.getMessage());
        assertNull(result.getData());
        verify(confirmViewingHandler).handle(any(ConfirmViewingCommand.class));
        verify(viewingRepository).findById(viewingId);
        verify(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_CONFIRMED));
    }

    @Test
    void completeViewing_Success() {
        // Arrange
        doNothing().when(completeViewingHandler).handle(any(CompleteViewingCommand.class));
        when(viewingRepository.findById(viewingId)).thenReturn(Optional.of(viewing));
        doNothing().when(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_COMPLETED));

        // Act
        ApiResponse<String> result = viewingService.completeViewing(viewingId);

        // Assert
        assertTrue(result.isSuccess());
        assertEquals("Viewing completed successfully", result.getMessage());
        assertNull(result.getData());
        verify(completeViewingHandler).handle(any(CompleteViewingCommand.class));
        verify(viewingRepository).findById(viewingId);
        verify(seller).updateScheduled(any(ViewingRequest.class), eq(EventType.VIEWING_COMPLETED));
    }
}