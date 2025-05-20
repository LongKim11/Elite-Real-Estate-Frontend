package com.realestatemarket.authenticationservice.decorator;

import com.realestatemarket.authenticationservice.entity.User;

public abstract class UserDecoratorAbstract implements UserDecorator {
    protected final UserDecorator decoratedUser;

    public UserDecoratorAbstract(UserDecorator decoratedUser) {
        this.decoratedUser = decoratedUser;
    }

    @Override public User getUser() { return decoratedUser.getUser(); }
    @Override public String getFullName() { return decoratedUser.getFullName(); }
    @Override public Integer getVipGoldCount() { return decoratedUser.getVipGoldCount(); }
    @Override public Integer getVipSilverCount() { return decoratedUser.getVipSilverCount(); }
    @Override public Integer getRegularCount() { return decoratedUser.getRegularCount(); }
    @Override public Integer getPushCount() { return decoratedUser.getPushCount(); }
    @Override public boolean hasFastPublish() { return decoratedUser.hasFastPublish(); }
    @Override public boolean hasImageCopyright() { return decoratedUser.hasImageCopyright(); }
    @Override public boolean canSchedulePost() { return decoratedUser.canSchedulePost(); }
    @Override public boolean hasPerformanceReport() { return decoratedUser.hasPerformanceReport(); }
    @Override public boolean canBulkOperation() { return decoratedUser.canBulkOperation(); }
}