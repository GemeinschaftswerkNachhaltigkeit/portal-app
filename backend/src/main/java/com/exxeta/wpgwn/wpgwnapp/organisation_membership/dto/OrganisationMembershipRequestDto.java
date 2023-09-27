package com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;

@Data
public class OrganisationMembershipRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private OrganisationMembershipUserType userType;
}
