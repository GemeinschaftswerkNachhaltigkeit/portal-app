package com.exxeta.wpgwn.wpgwnapp.activity_subscription;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.model.ActivitySubscription;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface ActivitySubscriptionRepository
        extends JpaRepository<ActivitySubscription, Long>,
        QuerydslPredicateExecutor<ActivitySubscription> {

    Page<ActivitySubscription> findAllBySubscribedUserId(String userId, Pageable pageable);
    Optional<ActivitySubscription> findBySubscribedUserIdAndActivity(String userId, Activity activity);
}
