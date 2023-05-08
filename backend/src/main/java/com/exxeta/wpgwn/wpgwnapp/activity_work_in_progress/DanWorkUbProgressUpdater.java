package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;


import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityUpdateEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.event.AddDanToOrganisationEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipService;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;

import com.querydsl.core.types.Predicate;

@Component
@RequiredArgsConstructor
public class DanWorkUbProgressUpdater {

    private final WpgwnProperties wpgwnProperties;

    private final OrganisationService organisationService;

    private final OrganisationMembershipService organisationMembershipService;

    private final ActivityWorkInProgressRepository activityWorkInProgressRepository;

    private final ApplicationEventPublisher applicationEventPublisher;

    @EventListener
    public void handleAddDanWorkInProgressToOrganisationEvent(AddDanToOrganisationEvent addDanToOrganisationEvent) {
        final Organisation organisation =
                organisationService.getOrganisation(addDanToOrganisationEvent.getOrganisationId());
        final List<UserRepresentation> users =
                organisationMembershipService.getAllKeycloakUserByOrganisation(organisation);
        for (UserRepresentation user : users) {
            Predicate predicate = QActivityWorkInProgress.activityWorkInProgress.activityType.eq(ActivityType.DAN)
                    .and(QActivityWorkInProgress.activityWorkInProgress.organisation.id.eq(wpgwnProperties.getDanId()))
                    .and(QActivityWorkInProgress.activityWorkInProgress.createdBy.eq(user.getId()));

            List<ActivityWorkInProgress> all
                    = StreamSupport.stream(activityWorkInProgressRepository.findAll(predicate).spliterator(), false)
                    .peek(activityWorkInProgress -> activityWorkInProgress.setOrganisation(organisation))
                    .collect(Collectors.toList());

            activityWorkInProgressRepository.saveAll(all);

            if (!all.isEmpty()) {
                applicationEventPublisher.publishEvent(new ActivityUpdateEvent(new Activity()));
            }
        }
    }
}
