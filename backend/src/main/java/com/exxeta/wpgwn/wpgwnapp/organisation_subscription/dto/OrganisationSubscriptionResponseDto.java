package com.exxeta.wpgwn.wpgwnapp.organisation_subscription.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationResponseDto;

@Data
public class OrganisationSubscriptionResponseDto {

    private final Long id;
    private final OrganisationResponseDto organisation;
    private final String subscribedUserId;

}
