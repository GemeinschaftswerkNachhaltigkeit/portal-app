package com.exxeta.wpgwn.wpgwnapp.api.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiOrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ImageMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface ApiOrganisationMapper {

    @Mapping(target = "importType", source = "importProcess.importType")
    @Mapping(target = "importSource", source = "importProcess.importSource")
    @Mapping(target = "source", source = "source")
    ApiOrganisationResponseDto organisationToDto(Organisation organisation);

}
