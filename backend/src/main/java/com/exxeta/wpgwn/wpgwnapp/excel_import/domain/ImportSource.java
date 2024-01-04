package com.exxeta.wpgwn.wpgwnapp.excel_import.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ImportSource {
    NONE(""),
    RNE("email/organisation-work-in-progress/privacy-consent/organisation-privacy-consent.html"),
    BERTELSMANN(""),
    KVM(""),

    DNP("email/organisation-work-in-progress/privacy-consent/organisation-privacy-consent-dnp.html"),

    NRW("email/organisation-work-in-progress/privacy-consent/organisation-privacy-consent-nrw.html"),

    DAN_XML(""),
    GLOBAL_GOALS_DIRECTORY("");

    @Getter
    private final String privacyConsentEmailTemplate;
}
