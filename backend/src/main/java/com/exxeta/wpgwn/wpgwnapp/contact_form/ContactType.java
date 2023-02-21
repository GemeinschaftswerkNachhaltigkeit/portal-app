package com.exxeta.wpgwn.wpgwnapp.contact_form;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ContactType {

    @JsonProperty("tech")
    TECH,

    @JsonProperty("content")
    CONTENT,

    @JsonProperty("idea")
    IDEA
}
