package com.exxeta.wpgwn.wpgwnapp.shared.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum BannerImageMode {
    @JsonProperty("cover")
    COVER,
    @JsonProperty("contain")
    CONTAIN;
}
