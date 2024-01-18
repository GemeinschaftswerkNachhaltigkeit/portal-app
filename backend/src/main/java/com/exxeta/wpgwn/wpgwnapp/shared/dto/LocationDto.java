package com.exxeta.wpgwn.wpgwnapp.shared.dto;

import jakarta.validation.Valid;
import java.io.Serializable;
import java.util.Optional;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;
import org.locationtech.jts.geom.Point;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiPointSchema;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@SuppressWarnings("MagicNumber")
public class LocationDto implements Serializable {

    @Valid
    private AddressDto address;

    private Boolean online;

    private Boolean privateLocation;

    @URL
    @Length(max = 1000)
    private String url;

    /**
     * Optional, um die Koordinaten wieder löschen zu können. Jackson unterscheidet,
     * ob der Wert nicht vorhanden ist (Optional == null)
     * oder der Wert im Json wurde auf "null" gesetzt (Optional.empty)
     */
    @Schema(implementation = ApiPointSchema.class,
            example = "{ \"type\": \"Point\", \"coordinates\": [30, 10] }")
    private Optional<Point> coordinate;
}
