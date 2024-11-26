package com.exxeta.wpgwn.wpgwnapp.api.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiOrganisationCsvDto;
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


    @Mapping(target = "sustainableDevelopmentGoals", expression = "java(dto.getSustainableDevelopmentGoals().toString())")
    @Mapping(target = "contactLastName", source = "contact.lastName")
    @Mapping(target = "contactFirstName", source = "contact.firstName")
    @Mapping(target = "contactPosition", source = "contact.position")
    @Mapping(target = "contactEmail", source = "contact.email")
    @Mapping(target = "contactPhone", source = "contact.phone")
    @Mapping(target = "contactImage", source = "contact.image")
    @Mapping(target = "locationName", source = "location.address.name")
    @Mapping(target = "street", source = "location.address.street")
    @Mapping(target = "streetNo", source = "location.address.streetNo")
    @Mapping(target = "supplement", source = "location.address.supplement")
    @Mapping(target = "zipCode", source = "location.address.zipCode")
    @Mapping(target = "city", source = "location.address.city")
    @Mapping(target = "state", source = "location.address.state")
    @Mapping(target = "country", source = "location.address.country")
    @Mapping(target = "online", source = "location.online")
    @Mapping(target = "privateLocation", source = "location.privateLocation")
    @Mapping(target = "url", source = "location.url")
    @Mapping(target = "coordinate", expression = "java(dto.getLocation() != null && dto.getLocation().getCoordinate()!= null ? dto.getLocation().getCoordinate().toString() : null)")
    @Mapping(target = "socialMediaContacts", expression = "java(dto.getSocialMediaContacts() != null ? dto.getSocialMediaContacts().toString() : null)")
    @Mapping(target = "thematicFocus", expression = "java(dto.getThematicFocus().toString())")
    ApiOrganisationCsvDto toCsvDto(ApiOrganisationResponseDto dto);

}
