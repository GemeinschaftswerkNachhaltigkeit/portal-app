package com.exxeta.wpgwn.wpgwnapp.shared.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@RequiredArgsConstructor
@Schema(description = "Special types")
public enum SpecialType {

    /*
     * Veranstaltung
     */
    EVENT,

    /**
     * Dan
     */
    DAN;


}
