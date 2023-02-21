package com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto;

import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;

import lombok.Data;

@Data
public class OrganisationMembershipRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private OrganisationMembershipUserType userType;
}
