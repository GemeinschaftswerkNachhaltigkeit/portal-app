package com.exxeta.wpgwn.wpgwnapp.marketplace.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.shared.model.SearchableEnum;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@RequiredArgsConstructor
@Schema(description = "Market place offer categories")
public enum OfferCategory implements SearchableEnum {

    /**
     * Jobs
     */
    JOBS("Jobs"),

    /**
     * Berichtstandards
     */
    REPORTING_STANDARDS("Berichtstandards"),

    /**
     * Bildungsangebote
     */
    EDUCATIONAL_OFFERS("Bildungsangebote"),

    /**
     * Förderprogramme und Finanzhilfen
     */
    FUNDING_PROGRAMMES_AND_GRANTS("Förderprogramme und Finanzhilfen"),

    /**
     * Wettbewerbe
     */
    CONTESTS("Wettbewerbe"),

    /**
     * Ehrenamtliche Unterstützung
     */
    VOLUNTEERING("Ehrenamtliche Unterstützung"),

    /**
     * Materialien
     */
    MATERIALS("Materialien"),

    /**
     * Räumlichkeiten
     */
    FACILITIES("Räumlichkeiten"),

    /**
     * Beratung
     */
    CONSULTING("Beratung"),

    /**
     * Sonstiges
     */
    OTHER("Sonstiges"),

    /**
     * Netzwerk
     */
    NETWORK("Netzwerk"),

    /**
     * Projekt Nachhaltigkeit
     */
    PROJECT_SUSTAINABILITY("Projekt Nachhaltigkeit");

    private final String nameDe;

}
