package com.exxeta.wpgwn.wpgwnapp.exception;

import org.springframework.validation.BindingResult;

import lombok.Value;

/**
 * Ein Validierungsfehler der signalisiert, dass etwas mit den übergebenen Daten nicht stimmt.
 * Es handelt sich um eine RuntimeException, damit diese innerhalb von Transaktionen zurückgerollt wird.
 */
@Value
public class ValidationException extends RuntimeException {

    private final BindingResult bindingResult;

}
