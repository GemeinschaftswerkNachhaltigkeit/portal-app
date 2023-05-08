package com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto;

import java.util.List;

import lombok.Data;

@Data
public class OrganisationMembershipsDto {

    private final List<OrganisationMembershipResponseDto> members;
}
