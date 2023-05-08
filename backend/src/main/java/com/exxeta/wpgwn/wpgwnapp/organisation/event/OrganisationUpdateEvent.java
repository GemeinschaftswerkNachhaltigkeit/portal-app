package com.exxeta.wpgwn.wpgwnapp.organisation.event;

import lombok.Value;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

@Value
public class OrganisationUpdateEvent {

    private final Organisation updatedOrganisation;

}
