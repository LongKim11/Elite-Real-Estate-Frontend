package com.realestatemarket.listingservice.command;

import com.realestatemarket.listingservice.entity.Property;

public class UpdateProjectNameCommand implements ListingCommand {
    private final Property property;
    private final String newProjectName;
    private String oldProjectName;

    public UpdateProjectNameCommand(Property property, String newProjectName) {
        if (property == null) {
            throw new IllegalArgumentException("Property cannot be null");
        }
        this.property = property;
        this.newProjectName = newProjectName;
    }

    @Override
    public void execute() {
        oldProjectName = property.getProjectName();
        property.setProjectName(newProjectName);
    }

    @Override
    public void undo() {
        property.setProjectName(oldProjectName);
    }

    @Override
    public void redo() {
        property.setProjectName(newProjectName);  
    }

    public String getNewProjectName() {
        return newProjectName;
    }
    public String getOldProjectName() {
        return oldProjectName;
    }
}