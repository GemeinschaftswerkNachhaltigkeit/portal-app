package com.exxeta.wpgwn.wpgwnapp.organisation;

import jakarta.annotation.security.RolesAllowed;
import jakarta.persistence.EntityNotFoundException;

import java.util.Objects;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;

import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationDetailsResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.event.OrganisationDeleteEvent;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.QOrganisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressDto;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/v1/organisations")
@RequiredArgsConstructor
@Transactional
public class OrganisationController {

    private final OrganisationService organisationService;
    private final OrganisationDeletionService organisationDeletionService;
    private final OrganisationMapper organisationMapper;
    private final OrganisationWorkInProgressService organisationWorkInProgressService;
    private final OrganisationWorkInProgressMapper organisationWorkInProgressMapper;
    private final OrganisationValidator organisationValidator;
    private final GeometryFactory factory;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final WpgwnProperties wpgwnProperties;

    /**
     * Legt einen neuen Arbeitsstand für eine bereits vorhandene Organisation an,
     * um diesen im Wizard weiter zu bearbeiten.
     */
    @RolesAllowed({PermissionPool.ORGANISATION_CHANGE, PermissionPool.RNE_ADMIN})
    @PutMapping("/{organisationId}")
    public OrganisationWorkInProgressDto updateOrganisation(@PathVariable("organisationId") Long organisationId,
                                                            @Parameter(hidden = true) @AuthenticationPrincipal
                                                            OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationMapper.mapOrganisationToWorkInProgress(organisation);
        final OrganisationWorkInProgress savedWorkInProgress =
                organisationWorkInProgressService.save(organisationWorkInProgress);
        return organisationWorkInProgressMapper.organisationWorkInProgressToDto(savedWorkInProgress);
    }

    @GetMapping
    public Page<OrganisationResponseDto> getPagedOrganisation(
            @RequestParam(value = "envelope", required = false) Envelope envelope,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "nocoordinates", required = false) Boolean nocoordinates,
            @QuerydslPredicate(root = Organisation.class, bindings = OrganisationBindingCustomizer.class)
            Predicate filterPredicate,
            Pageable pageable) {

        final BooleanBuilder searchPredicate = new BooleanBuilder(filterPredicate);
        if (Objects.nonNull(envelope)) {
            searchPredicate.and(QOrganisation.organisation.location.coordinate
                    .within(factory.toGeometry(envelope)));
        }

        if (StringUtils.hasText(query)) {
            BooleanExpression searchFieldsForQuery = QOrganisation.organisation.name.containsIgnoreCase(query)
                    .or(QOrganisation.organisation.description.containsIgnoreCase(query));
            searchPredicate.and(searchFieldsForQuery);
        }
        if (Boolean.TRUE.equals(nocoordinates)) {
            BooleanExpression invalidCoordinates = QOrganisation.organisation.location.online.isFalse()
                    .and(QOrganisation.organisation.location.coordinate.isNull());
            searchPredicate.and(invalidCoordinates);
        }
        // exclusive Default Org for Action Day
        searchPredicate.and(QOrganisation.organisation.id.ne(wpgwnProperties.getDanId()));

        final Page<Organisation> organisationPage = organisationService.findAll(searchPredicate, pageable);
        return organisationPage.map(organisationMapper::organisationToDto);
    }

    @GetMapping("/{orgId}")
    public OrganisationDetailsResponseDto getOrganisationDetails(@PathVariable("orgId") Long organisationId) {
        return organisationService.findById(organisationId)
                .map(organisationMapper::organisationToDetailsDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Organisation", organisationId)));
    }

    @DeleteMapping("/{orgId}")
    @RolesAllowed({PermissionPool.ORGANISATION_DELETE, PermissionPool.RNE_ADMIN})
    public void deleteOrganisation(@PathVariable("orgId") Long organisationId,
                                   @Parameter(hidden = true) @AuthenticationPrincipal
                                   OAuth2AuthenticatedPrincipal principal) {
        Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        organisationDeletionService.deleteOrganisation(organisation);

        applicationEventPublisher.publishEvent(new OrganisationDeleteEvent(organisation.getId()));
    }

    @RolesAllowed({PermissionPool.RNE_ADMIN})
    @PutMapping("/{organisationId}/toggle-initiator")
    public OrganisationDetailsResponseDto toggleOrganisationInitiatorFlag(
            @PathVariable("organisationId") Long organisationId,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        organisation.setInitiator(!organisation.getInitiator());
        final Organisation updatedOrganisation = organisationService.save(organisation);
        return organisationMapper.organisationToDetailsDto(updatedOrganisation);
    }

    @RolesAllowed({PermissionPool.RNE_ADMIN})
    @PutMapping("/{organisationId}/toggle-project-sustainability-winner")
    public OrganisationDetailsResponseDto toggleOrganisationSustainabilityWinnerFlag(
            @PathVariable("organisationId") Long organisationId,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        organisation.setProjectSustainabilityWinner(!organisation.getProjectSustainabilityWinner());
        final Organisation updatedOrganisation = organisationService.save(organisation);
        return organisationMapper.organisationToDetailsDto(updatedOrganisation);
    }
}
