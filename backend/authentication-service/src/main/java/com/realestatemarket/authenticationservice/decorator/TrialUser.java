package com.realestatemarket.authenticationservice.decorator;

import com.realestatemarket.authenticationservice.entity.User;

public class TrialUser implements UserDecorator {
    private final User user;
    
    public TrialUser(User user) {
        this.user = user;
    }

    @Override public User getUser() { return user; }
    @Override public String getFullName() { return user.getFullName(); }
    @Override public Integer getVipGoldCount() { return 0; }
    @Override public Integer getVipSilverCount() { return 0; }
    @Override public Integer getRegularCount() { return 3; }
    @Override public Integer getPushCount() { return 3; }
    @Override public boolean hasFastPublish() { return false; }
    @Override public boolean hasImageCopyright() { return false; }
    @Override public boolean canSchedulePost() { return false; }
    @Override public boolean hasPerformanceReport() { return false; }
    @Override public boolean canBulkOperation() { return false; }
}