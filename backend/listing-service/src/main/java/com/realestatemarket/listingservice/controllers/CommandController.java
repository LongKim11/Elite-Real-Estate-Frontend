package com.realestatemarket.listingservice.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.realestatemarket.listingservice.command.ListingCommandManager;
import com.realestatemarket.listingservice.entity.Property;
import com.realestatemarket.listingservice.response.ApiResponse;
import com.realestatemarket.listingservice.services.PropertyService;

@RestController
@RequestMapping("/api/v1/command")
public class CommandController {

    private final ListingCommandManager commandManager;
    private final Map<UUID, Property> inMemoryProperties = new HashMap<>();
    private final PropertyService propertyService;

    public CommandController(ListingCommandManager commandManager,
                            PropertyService propertyService
                            ) {
        this.commandManager = commandManager;
        this.propertyService = propertyService;
    }

    // 1. Load Property by ID
    @GetMapping("/{id}")
    public ApiResponse<Property> getProperty(@PathVariable UUID id) {
        // Property property = inMemoryProperties.get(id);
        // if (property == null) {
        //     return new ApiResponse<>(false, "Property not found", null, "Property with given ID does not exist.");
        // }
        // return new ApiResponse<>(true, "Property loaded successfully", property, null);
        return propertyService.getPropertyUpdate(id);
    }

    // 2. Update Title
    @PostMapping("/{id}/update-title")
    public ApiResponse<Property> updateTitle(@PathVariable UUID id, @RequestParam String newTitle) {
        // Property property = inMemoryProperties.get(id);
        // if (property == null) {
        //     return new ApiResponse<>(false, "Property not found", null, "Property with given ID does not exist.");
        // }

        // ListingCommand command = new UpdateTitleCommand(property, newTitle);
        // commandManager.executeCommand(command);

        // return new ApiResponse<>(true, "Title updated successfully", property, null);
        return propertyService.updateTitle(id, newTitle);
    }

    // 3. Update Description
    @PostMapping("/{id}/update-description")
    public ApiResponse<Property> updateDescription(@PathVariable UUID id, @RequestParam String newDescription) {
        // Property property = inMemoryProperties.get(id);
        // if (property == null) {
        //     return new ApiResponse<>(false, "Property not found", null, "Property with given ID does not exist.");
        // }

        // ListingCommand command = new UpdateDescriptionCommand(property, newDescription);
        // commandManager.executeCommand(command);

        // return new ApiResponse<>(true, "Description updated successfully", property, null);
        return propertyService.updateDescription(id, newDescription);
    }

    // 4. Update Project Name
    @PostMapping("/{id}/update-project")
    public ApiResponse<Property> updateProject(@PathVariable UUID id, @RequestParam String newProject) {
        // Property property = inMemoryProperties.get(id);
        // if (property == null) {
        //     return new ApiResponse<>(false, "Property not found", null, "Property with given ID does not exist.");
        // }

        // ListingCommand command = new UpdateProjectNameCommand(property, newProject);
        // commandManager.executeCommand(command);

        // return new ApiResponse<>(true, "Project name updated successfully", property, null);
        return propertyService.updateProject(id, newProject);
    }

    // 5. Undo
    @PostMapping("/undo")
    public ApiResponse<String> undo() {
        // commandManager.undoLast();
        // String lastActionInfo = commandManager.getLastActionInfo(false);
        // return new ApiResponse<>(true, "Undo successful", lastActionInfo, null);
        return propertyService.undo();
    }

    // 6. Redo
    @PostMapping("/redo")
    public ApiResponse<String> redo() {
        // String result = commandManager.getLastActionInfo(true);
        // commandManager.redo();
        // return new ApiResponse<>(true, "Redo successful", result, null);
        return propertyService.redo();
    }
}
