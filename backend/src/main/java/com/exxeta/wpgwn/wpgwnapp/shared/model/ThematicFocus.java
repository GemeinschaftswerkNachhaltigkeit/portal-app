package com.exxeta.wpgwn.wpgwnapp.shared.model;

import java.util.Arrays;

import lombok.Getter;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Schema(description = "Thematic focus")
public enum ThematicFocus implements SearchableEnum {

    /**
     * Beteiligung, Engagement und Partizipation
     */
    PARTICIPATION(1, "Beteiligung und Engagement"),

    /**
     * Bildung, Forschung und Wissenschaft
     */
    EDUCATION(2, "Bildung und Wissenschaft"),

    /**
     * Biodiversität, Artenschutz und Schutz natürlicher Ressourcen
     */
    BIODIVERSITY(3, "Biodiversität"),

    /**
     * Demokratie und Menschenrechte
     */
    HUMAN_RIGHTS(4, "Demokratie und Menschenrechte"),

    /**
     * Diversität, Geschlechtergerechtigkeit, Inklusion und Anti-Diskriminierung
     */
    GENDER_EQUITY(5, "Diversität und Inklusion"),

    /**
     * Frieden und Sicherheit
     */
    PEACE(6, "Frieden und Sicherheit"),

    /**
     * Internationale Verantwortung
     */
    INTERNATIONAL_RESPONSIBILITY(7, "Internationale Verantwortung"),

    /**
     * Klimaschutz und Energiewende
     */
    CLIMATE_PROTECTION(8, "Klimaschutz und Energiewende"),

    /**
     * Kreislaufwirtschaft
     */
    CIRCULAR_ECONOMY(9, "Kreislaufwirtschaft"),

    /**
     * Kultur, gesellschaftlicher Wandel und soziale Innovation
     */
    CULTURAL_SOCIAL_CHANGE(10, "Kultur und Soziale Innovation"),

    /**
     * Landwirtschaft und Ernährung
     */
    AGRICULTURE(11, "Landwirtschaft und Ernährung"),

    /**
     * Mobilität und Verkehrswende
     */
    MOBILITY(12, "Mobilität und Verkehrswende"),

    /**
     * Nachhaltige Beschaffung
     */
    SUSTAINABLE_PROCUREMENT(13, "Nachhaltige Beschaffung"),

    /**
     * Nachhaltige Finanzen
     */
    SUSTAINABLE_FINANCE(14, "Nachhaltige Finanzen"),

    /**
     * Nachhaltiger Konsum und Lebensstile
     */
    SUSTAINABLE_LIFESTYLE(15, "Nachhaltiger Konsum"),

    /**
     * Nachhaltiges Bauen und Wohnen
     */
    SUSTAINABLE_BUILDING(16, "Nachhaltiges Bauen und Wohnen"),

    /**
     * Nachhaltiges Wirtschaften
     */
    SUSTAINABLE_BUSINESS(17, "Nachhaltiges Wirtschaften"),

    /**
     * Nachhaltigkeitsgovernance
     */
    SUSTAINABLE_GOVERNANCE(18, "Nachhaltigkeitsgovernance"),

    /**
     * Soziale Gerechtigkeit, gute Arbeit und Chancengleichheit
     */
    SOCIAL_JUSTICE(19, "Soziale Gerechtigkeit"),

    /**
     * Sport
     */
    SPORT(20, "Sport"),

    /**
     * Stadtentwicklung, Entwicklung ländlicher Räume und Quartiersentwicklung
     */
    URBAN_DEVELOPMENT(21, "Entwicklung von Stadt und Land"),

    /**
     * Tourismus
     */
    TOURISM(22, "Tourismus"),

    /**
     * Sonstiges
     */
    OTHER(23, ""),

    DIGITALIZATION(24, "Digitalisierung");

    private final int id;

    /**
     * Deutscher Name für den Wert. Nach diesem Wert kann in der Volltextsuche gesucht werden.
     */
    private final String nameDe;

    ThematicFocus(int id, String nameDe) {
        this.id = id;
        this.nameDe = nameDe;
    }

    public static ThematicFocus getById(int id) {
        return Arrays.stream(values())
                .filter(v -> v.getId() == id)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No ThematicFocus for id [" + id + "]"));
    }
}
