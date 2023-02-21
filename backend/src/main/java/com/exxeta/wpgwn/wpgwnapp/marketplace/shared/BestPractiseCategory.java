package com.exxeta.wpgwn.wpgwnapp.marketplace.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.shared.model.SearchableEnum;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@RequiredArgsConstructor
@Schema(description = "Market place best practise categories")
public enum BestPractiseCategory implements SearchableEnum {

    SUSTAINABILITY_REPORTING("Nachhaltigkeitsberichtserstattung"),
    PROJECT_REPORT("Projektberichte"),
    OTHER("Sonstiges");

    private final String nameDe;
}
