package com.realestatemarket.authenticationservice.decorator;

public class BasicUserDecorator extends UserDecoratorAbstract {
    public BasicUserDecorator(UserDecorator decoratedUser) {
        super(decoratedUser);
    }

    @Override public Integer getRegularCount() { return 15; }
    @Override public Integer getPushCount() { return 15; }
    @Override public boolean hasFastPublish() { return true; }
    @Override public boolean hasImageCopyright() { return true; }
}