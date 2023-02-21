package com.exxeta.wpgwn.wpgwnapp.shared.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@RequiredArgsConstructor
@Schema(description = "Type of the organisation")
public enum OrganisationType implements SearchableEnum {

    /**
     * Bildungseinrichtung
     */
    EDUCATION("Bildungseinrichtung"),

    /**
     * Bund
     */
    FEDERAL("Bund"),
    /**
     * Bundesland
     */
    STATE("Bundesland"),

    /**
     * Finanzsektor
     */
    FINANCE("Finanzsektor"),

    /**
     * Gewerkschaft
     */
    UNION("Gewerkschaft"),

    /**
     * Religionsgemeinschaft
     */
    RELIGION("Religionsgemeinschaft"),

    /**
     * Kommune
     */
    MUNICIPALITY("Kommune"),

    /**
     * Kultureinrichtung
     */
    CULTURAL("Kultureinrichtung"),

    /**
     * Partei
     */
    PARTY("Partei"),

    /**
     * Sportverein
     */
    SPORTS_CLUB("Sportverein"),

    /**
     * Stiftung
     */
    FOUNDATION("Stiftung"),

    /**
     * Verband/ Nichtregierungsorganisation
     */
    NON_GOVERNMENT_ORGANISATION("Verband/ Nichtregierungsorganisation"),

    /**
     * Verein/ Initiative
     */
    ASSOCIATION("Verein/ Initiative"),

    /**
     * Wirtschaft
     */
    BUSINESS("Wirtschaft"),

    /**
     * Wissenschaft
     */
    SCIENCE("Wissenschaft"),

    /**
     * Sonstiges
     */
    OTHER("");

    /**
     * Deutscher Name für den Wert. Nach diesem Wert kann in der Volltextsuche gesucht werden.
     */
    private final String nameDe;

}
