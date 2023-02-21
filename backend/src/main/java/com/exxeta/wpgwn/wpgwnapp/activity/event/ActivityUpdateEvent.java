package com.exxeta.wpgwn.wpgwnapp.activity.event;

import lombok.Value;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;

@Value
public class ActivityUpdateEvent {

    private final Activity updatedActivity;

}
