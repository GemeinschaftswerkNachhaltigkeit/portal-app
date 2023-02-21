package com.exxeta.wpgwn.wpgwnapp.organisation_subscription;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.dto.OrganisationSubscriptionResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model.OrganisationSubscription;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, OrganisationMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class OrganisationSubscriptionMapper {

    abstract OrganisationSubscriptionResponseDto organisationSubscriptionToDto(OrganisationSubscription organisationSubscription);
}
