package com.realestatemarket.rentalservice.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.realestatemarket.rentalservice.entity.Viewing;
import com.realestatemarket.rentalservice.enums.EventType;
import com.realestatemarket.rentalservice.mediator.colleague.Buyer;
import com.realestatemarket.rentalservice.mediator.colleague.Seller;
import com.realestatemarket.rentalservice.mediator.command.CancelViewingCommand;
import com.realestatemarket.rentalservice.mediator.command.Command;
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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewingService {
    private final ScheduleViewingHandler scheduleViewingHandler;
    private final UpdateViewingHandler updateViewingHandler;
    private final CancelViewingHandler cancelViewingHandler;
    private final ConfirmViewingHandler confirmViewingHandler;
    private final CompleteViewingHandler completeViewingHandler;
    private final ViewingRepository viewingRepository;
    private final Buyer buyer;
    private final Seller seller;

    public ApiResponse<String> scheduleViewing(ViewingRequest request) {
        Command command = new ScheduleViewingCommand(request, scheduleViewingHandler);
        command.handle();
        buyer.scheduleViewing(request);

        return new ApiResponse<>(true, "Viewing scheduled successfully", null, null);
    }

    // Get all viewings
    public ApiResponse<List<Viewing>> getAllViewings() {
        List<Viewing> viewings = viewingRepository.findAll();
        return new ApiResponse<>(true, "List of viewings", viewings, null);
    }

    // Get all viewings for a property
    public ApiResponse<List<Viewing>> getViewingsByProperty(UUID propertyId) {
        List<Viewing> viewings = viewingRepository.findByPropertyId(propertyId);
        return new ApiResponse<>(true, "List of viewings", viewings, null);
    }

    // Delete a viewing
    public ApiResponse<String> deleteViewing(UUID id) {
        viewingRepository.deleteById(id);
        return new ApiResponse<>(true, "Viewing deleted successfully", null, null);
    }

    public ApiResponse<String> updateViewing(UUID id, UpdateViewingRequest request) {
        Command command = new UpdateViewingCommand(id, request, updateViewingHandler);
        command.handle();
        notifySeller(id, EventType.VIEWING_RESCHEDULED);

        return new ApiResponse<>(true, "Viewing updated successfully.", null, null);
    }

    public ApiResponse<Viewing> getViewingById(UUID id) {
        return viewingRepository.findById(id)
                .map(viewing -> new ApiResponse<>(true, "Viewing details", viewing, null))
                .orElseGet(() -> new ApiResponse<>(false, "Viewing not found", null, "The viewing does not exist"));
    }

    public ApiResponse<String> cancelViewing(UUID id) {
        Command command = new CancelViewingCommand(id, cancelViewingHandler);
        command.handle();
        notifySeller(id, EventType.VIEWING_CANCELLED);

        return new ApiResponse<>(true, "Viewing cancelled successfully", null, null);
    }

    public ApiResponse<String> confirmViewing(UUID id) {
        Command command = new ConfirmViewingCommand(id, confirmViewingHandler);
        command.handle();
        notifySeller(id, EventType.VIEWING_CONFIRMED);

        return new ApiResponse<>(true, "Viewing confirmed successfully", null, null);
    }

    public ApiResponse<String> completeViewing(UUID id) {
        Command command = new CompleteViewingCommand(id, completeViewingHandler);
        command.handle();
        notifySeller(id, EventType.VIEWING_COMPLETED);

        return new ApiResponse<>(true, "Viewing completed successfully", null, null);
    }

    private void notifySeller(UUID viewingId, EventType eventType) {
        viewingRepository.findById(viewingId).ifPresent(viewing -> {
            ViewingRequest request = new ViewingRequest();
            request.setPropertyId(viewing.getPropertyId());
            request.setScheduledAt(viewing.getScheduledAt());
            request.setViewNotes(viewing.getViewNotes());
            request.setViewerEmail(viewing.getViewerEmail());
            request.setViewerName(viewing.getViewerName());
            request.setViewerPhone(viewing.getViewerPhone());
            seller.updateScheduled(request, eventType);
        });
    }
}
