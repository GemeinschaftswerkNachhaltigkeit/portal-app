package com.exxeta.wpgwn.wpgwnapp.api.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Relevante Organisationsdaten die an Aktivitäten sichtbar sein sollen.
 */
@Data
public class ApiOrganisationDataDto implements Serializable {

    private final Long id;
    private final String name;
}
