package com.exxeta.wpgwn.wpgwnapp.activity_subscription.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;

@Data
public class ActivitySubscriptionResponseDto {

    private final Long id;
    private final ActivityResponseDto activity;
    private final String subscribedUserId;

}
