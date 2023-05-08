package com.exxeta.wpgwn.wpgwnapp.shared.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@RequiredArgsConstructor
@Schema(description = "Activity types")
public enum ActivityType implements SearchableEnum {

    /**
     * Netzwerk
     */
    NETWORK("Netzwerk"),

    /**
     * Veranstaltung
     */
    EVENT("Veranstaltung"),

    /**
     * Sonstiges
     */
    OTHER(""),

    /**
     * Dan
     */
    DAN("Dan");

    /**
     * Deutscher Name für den Wert. Nach diesem Wert kann in der Volltextsuche gesucht werden.
     */
    private final String nameDe;

}
