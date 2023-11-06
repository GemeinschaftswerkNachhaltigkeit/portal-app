package com.exxeta.wpgwn.wpgwnapp.map_search;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.map_search.dto.MapSearchMarkerResponseDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.dto.MapSearchResultWrapperDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapMarkerView;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapSearchV2Result;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {ActivityMapper.class, OrganisationMapper.class, SharedMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface MapSearchV2ResultMapper {

    MapSearchResultWrapperDto mapSearchResultToDto(MapSearchV2Result searchResult);

    @Mapping(target = "id", source = "mapMarkerView", qualifiedByName = "mapId")
    @Mapping(target = "coordinate", source = "coordinate")
    MapSearchMarkerResponseDto mapSearchMarkerResponseDto(MapMarkerView mapMarkerView);

    @Named("mapId")
    default Long mapId(MapMarkerView mapMarkerView) {
        switch (mapMarkerView.getResultType()) {
            case ORGANISATION:
                return mapMarkerView.getOrganisationId();
            case ACTIVITY:
            case DAN:
                return mapMarkerView.getActivityId();
            default:
                throw new IllegalArgumentException("No mapping defined for case ["
                        + mapMarkerView.getResultType()
                        + "]");
        }
    }

}
