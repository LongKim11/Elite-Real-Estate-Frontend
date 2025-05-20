package com.realestatemarket.listingservice.command;

import java.util.Stack;

import org.springframework.stereotype.Component;

@Component
public class ListingCommandManager {
    private final Stack<ListingCommand> undoStack = new Stack<>();
    private final Stack<ListingCommand> redoStack = new Stack<>();

    public void executeCommand(ListingCommand command) {
        if (command == null) {
            throw new IllegalArgumentException("Command cannot be null");
        }
        command.execute();
        undoStack.push(command);
        redoStack.clear();
    }

    public void undoLast() {
        if (!undoStack.isEmpty()) {
            ListingCommand lastCommand = undoStack.pop();
            lastCommand.undo();
            redoStack.push(lastCommand);
        }
    }

    public void redo() {
        if (!redoStack.isEmpty()) {
            ListingCommand command = redoStack.pop();
            command.redo();
            undoStack.push(command);
        }
    }

    public String getLastActionValue(boolean isRedo) {
        Stack<ListingCommand> stack = isRedo ? redoStack : undoStack;
        if (stack.isEmpty()) {
            return null; 
        }

        ListingCommand command = stack.peek();
        if (command instanceof UpdateTitleCommand updateTitleCommand) {
            return updateTitleCommand.getNewTitle();
        } else if (command instanceof UpdateProjectNameCommand updateProjectNameCommand) {
            return updateProjectNameCommand.getNewProjectName();
        } else if (command instanceof UpdateDescriptionCommand updateDescriptionCommand) {
            return updateDescriptionCommand.getNewDescription();
        }

        return null;
    }
}