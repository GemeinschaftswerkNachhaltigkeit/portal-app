package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Model Klasse für das Lesen der CSV Datei (zip_code_mapping/zuordnung_plz_ort.csv).
 */
@Data
public class ZipCode {

    @JsonProperty("osm_id")
    private String osmId;

    @JsonProperty("ags")
    private String ags;

    @JsonProperty("ort")
    private String city;

    @JsonProperty("plz")
    private String zipCode;

    @JsonProperty("landkreis")
    private String region;

    @JsonProperty("bundesland")
    private String state;

}
