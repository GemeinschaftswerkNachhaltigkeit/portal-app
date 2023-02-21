package com.exxeta.wpgwn.wpgwnapp.api.dto;

import lombok.Data;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GeoJson Point")
@Data
public class ApiPointSchema {

    private PointType type;
    private Double[] coordinates;

}
