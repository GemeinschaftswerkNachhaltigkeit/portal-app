package com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipStatus;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;

@Data
public class OrganisationMembershipResponseDto {
    private final UUID randomUniqueId;
    private final OrganisationSummaryDto organisation;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final OrganisationMembershipUserType userType;
    private final OrganisationMembershipStatus status;
    private final OffsetDateTime closedAt;
    private final OffsetDateTime expiresAt;
    private final Boolean emailSent;
}
