package com.exxeta.wpgwn.wpgwnapp.keycloak_client.dto;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
public class ClientDto {

    @JsonProperty("clientId")
    private String clientId;

    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;
}
