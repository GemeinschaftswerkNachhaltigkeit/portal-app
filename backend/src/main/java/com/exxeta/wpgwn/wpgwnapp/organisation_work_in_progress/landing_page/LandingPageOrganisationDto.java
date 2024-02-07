package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.landing_page;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;

/**
 * Dto zum Registrieren einer Organisation auf der LandingPage.
 * Alle Organisationen werden beim Anlegen auf {@link OrganisationWorkInProgress} gemappt und gespeichert.
 * Dort können unvollständige Organisationen gespeichert und vervollständigt werden.
 * Nur vollständige Organisationen werden als {@link Organisation} gespeichert.
 */
@Data
public class LandingPageOrganisationDto {
    @NotBlank
    private String name;

    @NotBlank
    @Email(message = "Not a valid e-mail address")
    private String emailAddress;

    @NotNull
    private Set<Long> sustainabilityGoals = new LinkedHashSet<>();

    private String contribution;

    @AssertTrue
    @NotNull
    private Boolean privacyConsent;
}
