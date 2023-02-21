package com.exxeta.wpgwn.wpgwnapp.organisation_subscription;


import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model.OrganisationSubscription;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganisationSubscriptionService {
    private final OrganisationSubscriptionRepository organisationSubscriptionRepository;
    private final OrganisationService organisationService;

    public OrganisationSubscription createOrganisationSubscriptionForOrganisationAndUser(Organisation organisation, String userName) {
        OrganisationSubscription organisationSubscription = new OrganisationSubscription();
        organisationSubscription.setOrganisation(organisation);
        organisationSubscription.setSubscribedUserId(userName);

        return organisationSubscriptionRepository.save(organisationSubscription);
    }
}
