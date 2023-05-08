package com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto;

import lombok.Value;

import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;

@Value
public class OrganisationMembershipEmailDto {

    private OrganisationMembership organisationMembership;
    private String adminFirstName;
    private String adminLastName;
    private String oneTimePassword;
}
