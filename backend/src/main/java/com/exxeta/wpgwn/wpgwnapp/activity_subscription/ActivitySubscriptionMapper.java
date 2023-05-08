package com.exxeta.wpgwn.wpgwnapp.activity_subscription;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.dto.ActivitySubscriptionResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.model.ActivitySubscription;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ActivityMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class ActivitySubscriptionMapper {

    abstract ActivitySubscriptionResponseDto activitySubscriptionToDto(ActivitySubscription activitySubscription);
}
