package com.exxeta.wpgwn.wpgwnapp.contact_invite;


import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, OrganisationMapper.class, OrganisationWorkInProgressMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class ContactInviteMapper {

    abstract ContactInviteDto contactInviteToDto(ContactInvite contactInvite);
}


