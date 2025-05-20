package com.realestatemarket.authenticationservice.decorator;

public class StandardUserDecorator extends UserDecoratorAbstract {
    public StandardUserDecorator(UserDecorator decoratedUser) {
        super(decoratedUser);
    }

    @Override public Integer getRegularCount() { return 30; }
    @Override public Integer getPushCount() { return 30; }
    @Override public Integer getVipSilverCount() { return 1; }
    @Override public boolean canSchedulePost() { return true; }
}