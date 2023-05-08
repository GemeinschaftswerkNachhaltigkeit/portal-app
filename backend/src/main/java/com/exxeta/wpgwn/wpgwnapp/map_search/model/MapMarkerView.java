package com.exxeta.wpgwn.wpgwnapp.map_search.model;

import org.locationtech.jts.geom.Point;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.map_search.MapSearchResultType;

/**
 * Bean für eine Projektion zum Abrufen der Daten mit QueryDSL.
 */
@Data
public class MapMarkerView {

    private Long organisationId;

    private Long activityId;

    private MapSearchResultType resultType;

    private Point coordinate;

}
