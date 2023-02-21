package com.exxeta.wpgwn.wpgwnapp.map_search;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityDeleteEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityUpdateEvent;
import com.exxeta.wpgwn.wpgwnapp.organisation.event.OrganisationDeleteEvent;
import com.exxeta.wpgwn.wpgwnapp.organisation.event.OrganisationUpdateEvent;

@Component
@RequiredArgsConstructor
public class MaterialisedViewUpdater {

    private final MapSearchResultRepository mapSearchResultRepository;

    @EventListener
    public void handleOrganisationUpdateEvent(OrganisationUpdateEvent organisationUpdateEvent) {
        mapSearchResultRepository.refreshView();
    }

    @EventListener
    public void handleOrganisationDeleteEvent(OrganisationDeleteEvent organisationDeleteEvent) {
        mapSearchResultRepository.refreshView();
    }

    @EventListener
    public void handleActivityUpdateEvent(ActivityUpdateEvent activityUpdateEvent) {
        mapSearchResultRepository.refreshView();
    }

    @EventListener
    public void handleActivityDeleteEvent(ActivityDeleteEvent activityDeleteEvent) {
        mapSearchResultRepository.refreshView();
    }

}
