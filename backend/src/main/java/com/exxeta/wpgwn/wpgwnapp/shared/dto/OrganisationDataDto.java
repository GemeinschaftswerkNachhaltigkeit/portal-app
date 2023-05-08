package com.exxeta.wpgwn.wpgwnapp.shared.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Relevante Organisationsdaten die an Aktivitäten sichtbar sein sollen.
 */
@Data
public class OrganisationDataDto implements Serializable {

    private final Long id;
    private final String name;
    private final String logo;
    private final String image;
}
