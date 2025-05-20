package com.realestatemarket.listingservice.command;

import com.realestatemarket.listingservice.entity.Property;

public class UpdateDescriptionCommand implements ListingCommand {
    private final Property property;
    private final String newDescription;
    private String oldDescription;

    public UpdateDescriptionCommand(Property property, String newDescription) {
        if (property == null) {
            throw new IllegalArgumentException("Property cannot be null");
        }
        this.property = property;
        this.newDescription = newDescription;
    }

    @Override
    public void execute() {
        oldDescription = property.getDescription();
        property.setDescription(newDescription);
    }

    @Override
    public void undo() {
        property.setDescription(oldDescription);
    }

    @Override
    public void redo() {
        property.setDescription(newDescription);  
    }

    public String getNewDescription() {
        return newDescription;
    }
    public String getOldDescription() {
        return oldDescription;
    }
}