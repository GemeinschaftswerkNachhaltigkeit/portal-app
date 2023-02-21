package com.exxeta.wpgwn.wpgwnapp.map_search.dto;

import org.locationtech.jts.geom.Point;

import lombok.Value;

import com.exxeta.wpgwn.wpgwnapp.map_search.MapSearchResultType;

@Value
public class MapSearchMarkerResponseDto {

    private final Long id;

    private final MapSearchResultType resultType;

    private final Point coordinate;

}
