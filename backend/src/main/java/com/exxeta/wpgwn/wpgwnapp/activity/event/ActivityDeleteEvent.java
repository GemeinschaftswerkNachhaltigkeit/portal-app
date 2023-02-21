package com.exxeta.wpgwn.wpgwnapp.activity.event;

import lombok.Value;

@Value
public class ActivityDeleteEvent {
    private Long organisationId;
    private Long activityId;
}
