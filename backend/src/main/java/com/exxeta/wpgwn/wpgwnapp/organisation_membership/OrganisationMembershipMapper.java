package com.exxeta.wpgwn.wpgwnapp.organisation_membership;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface OrganisationMembershipMapper {

    OrganisationMembershipResponseDto organisationMembershipToDto(OrganisationMembership organisationMembership);

}
