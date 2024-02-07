package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationDetailsResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationFeedbackRequestDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationRejectionRequestDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressWithDuplicateFlagResponseDto;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;


/**
 * Controller, die Administrationsfunktionen für Organisationen (WIP) zum Clearing bereitstellt.
 */
@RestController
@RequestMapping("/api/v1/manage-organisations")
@RequiredArgsConstructor
@Slf4j
@RolesAllowed(PermissionPool.RNE_ADMIN)
@Transactional
public class OrganisationWorkInProgressAdminController {

    private final OrganisationWorkInProgressService organisationWorkInProgressService;

    private final OrganisationWorkInProgressPublishService publishOrganisationWorkInProgress;

    private final OrganisationWorkInProgressMapper organisationWorkInProgressMapper;

    private final OrganisationWorkInProgressValidator organisationWorkInProgressValidator;

    private final OrganisationMapper organisationMapper;

    /**
     * Endpunkt, der alle Organisationen (paginiert) zurückliefert.
     *
     * @param pageable die Informationen zur gewünschten Paginierung
     * @return Seite mit den OrganisationsInformationen.
     */
    @GetMapping
    public Page<OrganisationWorkInProgressWithDuplicateFlagResponseDto> getOrganisationWorkInProgressPage(
            @QuerydslPredicate(root = OrganisationWorkInProgress.class, bindings = OrganisationWorkInProgressBindingCustomizer.class)
            Predicate filterPredicate,
            Pageable pageable) {
        return organisationWorkInProgressService.findAllByPredicate(filterPredicate, pageable)
                .map(organisationWorkInProgressMapper::organisationWorkInProgressToDtoWithDuplicates);
    }

    @PostMapping("send-reminder-emails")
    public void sendReminderEmails() {

        final BooleanExpression hasStatusNew =
                QOrganisationWorkInProgress.organisationWorkInProgress.status.eq(OrganisationStatus.NEW);
        final BooleanExpression noEmailsSent =
                QOrganisationWorkInProgress.organisationWorkInProgress.emailNotificationDates.isEmpty();
        final BooleanExpression sourceLandingPage =
                QOrganisationWorkInProgress.organisationWorkInProgress.source.eq(Source.LANDING_PAGE);

        final BooleanExpression predicate = hasStatusNew
                .and(noEmailsSent)
                .and(sourceLandingPage);
        final Iterable<OrganisationWorkInProgress> result =
                organisationWorkInProgressService.findAllByPredicate(predicate);

        result.forEach(organisationWorkInProgress ->
                organisationWorkInProgressService.sendReminderEmail(organisationWorkInProgress.getId()));
    }


    /**
     * Endpunkt zum Veröffentlichen einer Organisation auf der Karte vom RNE Admin im Clearing Prozess.
     * Benötigt einen eingeloggten Benutzer mit der Berechtigung zum Freischalten von Organisationen.
     *
     * @param id die ID der freizuschaltenden Organisation.
     * @return die Daten der freigeschalteten Organisation.
     */
    @PostMapping("/{id}/publish")
    public OrganisationDetailsResponseDto publishWorkInProgressToCreateOrganisation(@PathVariable("id") Long id) {

        final OrganisationWorkInProgress workInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgressById(id);
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressClearingByAdmin(workInProgress);
        final Organisation savedOrganisation =
                publishOrganisationWorkInProgress.publishOrganisationWorkInProgress(workInProgress);

        return organisationMapper.organisationToDetailsDto(savedOrganisation);
    }

    /**
     * Endpunkt zum Anfordern von zusätzlichen Informationen über die Organisation.
     * Benötigt einen eingeloggten Benutzer mit der Berechtigung zum Freischalten von Organisationen.
     *
     * @param id die ID der freizuschaltenden Organisation.
     * @return die Daten der freigeschalteten Organisation.
     */
    @PostMapping("/{id}/require-feedback")
    public OrganisationWorkInProgressDto feedbackRequiredWorkInProgress(@PathVariable("id") Long id,
                                                                        @RequestBody
                                                                        @Valid OrganisationFeedbackRequestDto feedbackRequestDto) {
        final OrganisationWorkInProgress workInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgressById(id);
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressClearingByAdmin(workInProgress);
        final OrganisationWorkInProgress updatedWorkInProgress =
                organisationWorkInProgressService.sendFeedbackEmail(workInProgress, feedbackRequestDto.getFeedback());

        return organisationWorkInProgressMapper.organisationWorkInProgressToDto(updatedWorkInProgress);
    }

    /**
     * Endpunkt zum Ablehnen einer Organisation im Clearing.
     * Benötigt einen eingeloggten Benutzer mit RNE_ADMIN Berechtigung.
     *
     * @param id die ID der abzulehnenden Organisation.
     * @return die Daten der abgelehnten Organisation.
     */
    @PostMapping("/{id}/reject")
    public OrganisationWorkInProgressDto rejectWorkInProgress(@PathVariable("id") Long id,
                                                              @RequestBody
                                                              @Valid OrganisationRejectionRequestDto rejectionRequestDto) {
        final OrganisationWorkInProgress workInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgressById(id);
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressClearingByAdmin(workInProgress);
        final OrganisationWorkInProgress updatedWorkInProgress =
                organisationWorkInProgressService.rejectOrganisation(workInProgress,
                        rejectionRequestDto.getRejectionReason());

        return organisationWorkInProgressMapper.organisationWorkInProgressToDto(updatedWorkInProgress);
    }
}
