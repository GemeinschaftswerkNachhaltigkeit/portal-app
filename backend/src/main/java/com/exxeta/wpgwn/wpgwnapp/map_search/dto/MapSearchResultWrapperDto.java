package com.exxeta.wpgwn.wpgwnapp.map_search.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.MapSearchResultType;
import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MapSearchResultWrapperDto {

    private final String name;

    private final String description;

    private final MapSearchResultType resultType;

    private final ActivityResponseDto activity;

    private final OrganisationResponseDto organisation;

    private final LocationDto location;

}
