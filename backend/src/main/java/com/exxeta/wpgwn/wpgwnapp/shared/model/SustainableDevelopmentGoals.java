package com.exxeta.wpgwn.wpgwnapp.shared.model;


import lombok.Getter;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Schema(description = "Sustainable development goals")
public enum SustainableDevelopmentGoals implements SearchableEnum {

    SDG_1("01", "Keine Armut"),
    SDG_2("02", "Kein Hunger"),
    SDG_3("03", "Gesundheit und Wohlergehen"),
    SDG_4("04", "Hochwertige Bildung"),
    SDG_5("05", "Geschlechtergleichheit"),
    SDG_6("06", "Sauberes Wasser und Sanitäreinrichtungen"),
    SDG_7("07", "Bezahlbare und saubere Energie"),
    SDG_8("08", "Menschenwürdige Arbeit und Wirtschaftswachstum"),
    SDG_9("09", "Industrie, Innovation und Infrastruktur"),
    SDG_10("10", "Weniger Ungleichheiten"),
    SDG_11("11", "Nachhaltige Städte und Gemeinden"),
    SDG_12("12", "Nachhaltige/r Konsum und Produktion"),
    SDG_13("13", "Maßnahmen zum Klimaschutz"),
    SDG_14("14", "Leben unter Wasser"),
    SDG_15("15", "Leben an Land"),
    SDG_16("16", "Frieden, Gerechtigkeit und starke Institutionen"),
    SDG_17("17", "Partnerschaften zur Erreichung der Ziele");

    private final String nameDe;
    private final String number;

    SustainableDevelopmentGoals(String number, String nameDe) {
        this.number = number;
        this.nameDe = nameDe;
    }
}
