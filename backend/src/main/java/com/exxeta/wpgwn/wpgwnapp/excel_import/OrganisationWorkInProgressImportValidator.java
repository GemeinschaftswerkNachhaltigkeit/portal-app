package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteRepository;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteStatus;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.QContactInvite;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.QOrganisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.QOrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;

import com.querydsl.core.types.Predicate;

@Component
@RequiredArgsConstructor
public class OrganisationWorkInProgressImportValidator {

    private final OrganisationWorkInProgressRepository workInProgressRepository;

    private final OrganisationRepository organisationRepository;

    private final ContactInviteRepository contactInviteRepository;

    /**
     * Prüft, ob die Aktivität für den Import valide ist.
     */
    public boolean isValidOrganisation(OrganisationWorkInProgress organisationWorkInProgress,
                                       List<OrganisationWorkInProgress> extractedOrganisationWorkInProgress) {
        return Objects.nonNull(organisationWorkInProgress)
                && hasName(organisationWorkInProgress)
                && hasContactEmailAddress(organisationWorkInProgress)
                && !existsInExtractedOrganisationWorkInProgress(organisationWorkInProgress,
                extractedOrganisationWorkInProgress)
                && !existsOrganisationWorkInProgressWithSameContactEmail(
                getEmailToLowerCase(organisationWorkInProgress))
                && !existsOrganisationWithSameContactEmail(
                getEmailToLowerCase(organisationWorkInProgress))
                && !existsContactInvite(getEmailToLowerCase(organisationWorkInProgress));
    }

    private boolean existsInExtractedOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress,
                                                                List<OrganisationWorkInProgress> extractedOrganisationWorkInProgress) {
        return extractedOrganisationWorkInProgress.stream()
                .anyMatch(org -> Objects.equals(
                        getEmailToLowerCase(org), getEmailToLowerCase(organisationWorkInProgress)));
    }

    private String getEmailToLowerCase(OrganisationWorkInProgress org) {
        return Optional.ofNullable(org)
                .map(OrganisationWorkInProgress::getContactWorkInProgress)
                .map(ContactWorkInProgress::getEmail)
                .map(String::toLowerCase)
                .orElse(null);
    }

    private boolean existsContactInvite(String email) {
        final Predicate predicate = QContactInvite.contactInvite.status.eq(ContactInviteStatus.OPEN)
                .and(QContactInvite.contactInvite.contact.email.equalsIgnoreCase(email));
        return contactInviteRepository.exists(predicate);
    }

    private boolean existsOrganisationWithSameContactEmail(String email) {
        final Predicate predicate = QOrganisation.organisation.contact.email.equalsIgnoreCase(email);
        return organisationRepository.exists(predicate);
    }

    private boolean existsOrganisationWorkInProgressWithSameContactEmail(String email) {
        final Predicate predicate = QOrganisationWorkInProgress.organisationWorkInProgress.contactWorkInProgress.email
                .equalsIgnoreCase(email);
        return workInProgressRepository.exists(predicate);
    }

    private boolean hasName(OrganisationWorkInProgress organisationWorkInProgress) {
        return StringUtils.hasText(organisationWorkInProgress.getName());
    }

    private boolean hasContactEmailAddress(OrganisationWorkInProgress organisationWorkInProgress) {
        return Optional.ofNullable(organisationWorkInProgress.getContactWorkInProgress())
                .map(ContactWorkInProgress::getEmail)
                .filter(StringUtils::hasText)
                .isPresent();
    }
}
