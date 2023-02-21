package com.exxeta.wpgwn.wpgwnapp.exception;

import lombok.Builder;
import lombok.Getter;

/**
 * Ein aufgetretener Fehler zur Rückgabe an APIs
 */
@Getter
@Builder
public class ErrorModel {

    /**
     * Feldname oder Eigenschaft, deren Wert den Fehler ausgelöst hat
     */
    private String fieldName;

    /**
     * Lokalisierte Fehlermeldung
     */
    private String message;

}
