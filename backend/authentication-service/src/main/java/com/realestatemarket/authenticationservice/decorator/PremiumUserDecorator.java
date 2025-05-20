package com.realestatemarket.authenticationservice.decorator;

public class PremiumUserDecorator extends UserDecoratorAbstract {
    public PremiumUserDecorator(UserDecorator decoratedUser) {
        super(decoratedUser);
    }

    @Override public Integer getRegularCount() { return 50; }
    @Override public Integer getPushCount() { return 50; }
    @Override public Integer getVipSilverCount() { return 2; }
    @Override public Integer getVipGoldCount() { return 1; }
    @Override public boolean hasPerformanceReport() { return true; }
}