package com.exxeta.wpgwn.wpgwnapp.duplicate_check;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.duplicate_check.dto.DuplicateListDto;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class,
                SharedMapper.class,
                OrganisationMapper.class,
                OrganisationWorkInProgressMapper.class})
public interface DuplicateListMapper {

    @Mapping(target = "organisationWorkInProgressId", source = "organisationWorkInProgress.id")
    @Mapping(target = "name", source = "organisationWorkInProgress.name")
    DuplicateListDto map(DuplicateList duplicateList);

}
