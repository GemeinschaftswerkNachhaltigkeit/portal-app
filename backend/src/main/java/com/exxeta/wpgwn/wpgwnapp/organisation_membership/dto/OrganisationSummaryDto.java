package com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Nur relevante Felder der Organisation, für die die Einladung ausgestellt wurde.
 */
@Data
public class OrganisationSummaryDto implements Serializable {

    private final Long id;
    private final String name;
}
