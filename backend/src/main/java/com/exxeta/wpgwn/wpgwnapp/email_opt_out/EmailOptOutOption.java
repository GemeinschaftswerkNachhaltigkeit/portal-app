package com.exxeta.wpgwn.wpgwnapp.email_opt_out;

import lombok.Getter;

@Getter
public enum EmailOptOutOption {
    CONTACT_INVITE(false), // Einladung Kontakt (not OptOutable)
    COMPANY_INVITE(false), // Einladung Organisation (not OptOutable)

    COMPANY_WIP_CONSENT(true), // Import (OptOutable)
    COMPANY_WIP_REMINDER(true), // Import Erinnerung (OptOutable)
    COMPANY_WIP_REJECT(false), // Clearing Abgelehnt (not OptOutable)
    COMPANY_WIP_FEEDBACK(false), // Clearing Rückfrage (not OptOutable)
    COMPANY_PUBLISHED(false); // Clearing Veröffentlicht (not OptOutable)

    private final boolean optOutable;

    EmailOptOutOption(boolean optOutable) {
        this.optOutable = optOutable;
    }
}
