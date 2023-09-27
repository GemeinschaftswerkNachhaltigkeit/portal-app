package com.exxeta.wpgwn.wpgwnapp.organisation_subscription;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model.OrganisationSubscription;

public interface OrganisationSubscriptionRepository
        extends JpaRepository<OrganisationSubscription, Long>,
        QuerydslPredicateExecutor<OrganisationSubscription> {

    Page<OrganisationSubscription> findAllBySubscribedUserId(String userId, Pageable pageable);

    Optional<OrganisationSubscription> findBySubscribedUserIdAndOrganisation(String userId, Organisation organisation);
}
