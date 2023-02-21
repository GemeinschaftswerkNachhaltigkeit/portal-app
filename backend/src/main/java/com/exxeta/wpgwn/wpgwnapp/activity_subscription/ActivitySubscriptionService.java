package com.exxeta.wpgwn.wpgwnapp.activity_subscription;


import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.model.ActivitySubscription;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivitySubscriptionService {
    private final ActivitySubscriptionRepository activitySubscriptionRepository;

    public ActivitySubscription createActivitySubscriptionForActivityAndUser(Activity activity, String userName) {
        ActivitySubscription activitySubscription = new ActivitySubscription();
        activitySubscription.setActivity(activity);
        activitySubscription.setSubscribedUserId(userName);

        return activitySubscriptionRepository.save(activitySubscription);
    }
}
