package com.realestatemarket.listingservice.command;

public interface ListingCommand {
    void execute();
    void undo();
    void redo();
}
