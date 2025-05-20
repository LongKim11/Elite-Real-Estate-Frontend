package com.realestatemarket.listingservice.command;

import com.realestatemarket.listingservice.entity.Property;

public class UpdateTitleCommand implements ListingCommand {
    private final Property property;
    private final String newTitle;
    private String oldTitle;

    public UpdateTitleCommand(Property property, String newTitle) {
        if (property == null) {
            throw new IllegalArgumentException("Property cannot be null");
        }
        this.property = property;
        this.newTitle = newTitle;
    }

    @Override
    public void execute() {
        oldTitle = property.getTitle();
        property.setTitle(newTitle);
    }

    @Override
    public void undo() {
        property.setTitle(oldTitle);
    }

    @Override
    public void redo() {
        property.setTitle(newTitle);
    }

    public String getNewTitle() {
        return newTitle;
    }
    public String getOldTitle() {
        return oldTitle;
    }
}