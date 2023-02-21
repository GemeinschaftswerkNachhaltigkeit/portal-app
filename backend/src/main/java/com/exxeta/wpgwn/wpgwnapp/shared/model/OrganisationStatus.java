package com.exxeta.wpgwn.wpgwnapp.shared.model;

public enum OrganisationStatus {

    /**
     * Organisation, bei der die Zustimmung zur Mitmacherklärung aussteht. Bevor Daten gepflegt werden können,
     * muss die Mitmacherklärung zugestimmt werden. Alternativ kann der Kontakt auch die Zustimmung verweigern.
     */
    PRIVACY_CONSENT_REQUIRED,

    /**
     * Organisation wurde registriert und Mitmacherklärung bestätigt.
     */
    NEW,

    /**
     * Organisation wurde vom Kontakt der Organisation geprüft und ist vom Kontakt zum Clearing freigegeben.
     */
    FREIGABE_KONTAKT_ORGANISATION,


    /**
     * Clearing hat die Freigabe für die Organisation erteilt.
     */
    FREIGABE_CLEARING,

    /**
     * Es gibt Rückfragen zur Organisation, die vom Kontakt zur Organisation nachgereicht werden müssen.
     */
    RUECKFRAGE_CLEARING,

    /**
     * Freigabe für die Organisation wurde vom Clearing verweigert.
     */
    FREIGABE_VERWEIGERT_CLEARING,

    /**
     * Die Freigabe wurde vom Kontakt der Organisation verweigert (Mitmacherklärung).
     */
    FREIGABE_VERWEIGERT_KONTAKT_INITIATIVE,

    /**
     * Status, wenn eine bereits veröffentlichte Organisation aktualisiert wird.
     */
    AKTUALISIERUNG_ORGANISATION

}
