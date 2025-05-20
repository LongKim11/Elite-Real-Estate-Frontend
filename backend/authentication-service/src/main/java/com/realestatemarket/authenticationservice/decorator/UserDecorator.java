package com.realestatemarket.authenticationservice.decorator;

import com.realestatemarket.authenticationservice.entity.User;

public interface UserDecorator {
    User getUser();
    String getFullName();
    Integer getVipGoldCount();
    Integer getVipSilverCount();
    Integer getRegularCount();
    Integer getPushCount();
    boolean hasFastPublish();
    boolean hasImageCopyright();
    boolean canSchedulePost();
    boolean hasPerformanceReport();
    boolean canBulkOperation();
}