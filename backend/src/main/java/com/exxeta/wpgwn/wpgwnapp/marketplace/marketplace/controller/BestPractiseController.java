package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.controller;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ItemStatusChangeDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.MarketplaceWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.BestPractiseWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

/**
 * Endpunkt zum Abrufen, Anlegen, Aktualisieren und Löschen von Praxisberichten.
 * Für einen vorhandenen Praxisbericht wird ein Work-in-progress Objekt erstellt,
 * dass bearbeitet werden kann. Anschließend können die Änderungen veröffentlicht werden.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/marketplace/best-practise")
@RequiredArgsConstructor
public class BestPractiseController {

    private final OrganisationValidator organisationValidator;

    private final OrganisationService organisationService;

    private final MarketplaceMapper marketplaceMapper;

    private final MarketplaceService marketplaceService;

    private final MarketplaceWorkInProgressService marketplaceWorkInProgressService;

    private final Clock clock;

    /**
     * Abrufen der Praxisbeispiele für eine Organisation. Keine Authentifizierung erforderlich.
     */
    @GetMapping
    public Page<BestPractiseResponseDto> getBestPractiseItems(@PathVariable("orgId") Long orgId, Pageable pageable,
                                                              @AuthenticationPrincipal
                                                              OAuth2AuthenticatedPrincipal principal) {
        final boolean hasPermissionToViewAll = organisationValidator.hasPermissionForOrganisation(principal, orgId);
        return marketplaceService.findBestPractiseByOrganisationId(orgId, !hasPermissionToViewAll, pageable)
                .map(marketplaceMapper::mapBestPractiseToResponseDto);
    }

    /**
     * Abrufen der Detailinformationen für ein Praxisbeispiel. Keine Authentifizierung erforderlich.
     */
    @GetMapping("{bestPractiseId}")
    public BestPractiseResponseDetailsDto getMarketplaceItemById(@PathVariable("orgId") Long orgId,
                                                                 @PathVariable("bestPractiseId") Long bestPractiseId) {
        final BestPractise bestPractise = marketplaceService.findMarketplaceItemById(bestPractiseId)
                .filter(item -> item instanceof BestPractise)
                .filter(item -> Objects.equals(item.getOrganisation().getId(), orgId))
                .map(item -> (BestPractise) item)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "BestPractise", bestPractiseId)));
        return marketplaceMapper.mapBestPractiseToResponseDetailsDto(bestPractise);
    }

    /**
     * Anlegen eines neuen "leeren" Praxisbeispiels, das einer Organisation zugeordnet ist.
     * Benötigt Rechte zum Ändern von Marktplatzangeboten.
     */
    @PostMapping
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public BestPractiseWorkInProgressResponseDto createOfferWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress bestPractiseWorkInProgress = new BestPractiseWorkInProgress();
        bestPractiseWorkInProgress.setOrganisation(organisation);
        bestPractiseWorkInProgress.setMarketplaceType(MarketplaceType.BEST_PRACTISE);
        bestPractiseWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        bestPractiseWorkInProgress.setRandomIdGenerationTime(Instant.now(clock));
        final BestPractiseWorkInProgress savedBestPractiseWorkInProgress =
                marketplaceWorkInProgressService.save(bestPractiseWorkInProgress);
        return marketplaceMapper.mapBestPractiseWorkInProgress(savedBestPractiseWorkInProgress);
    }

    /**
     * Endpunkt zum Aktualisieren eines Angebots.
     * Aus dem Angebot wird ein {@link OfferWorkInProgress} erstellt, das bearbeitet wird.
     * Am Ende der Bearbeitung wird der Endpunkt
     * {@link com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.controller.BestPracticeWorkInProgressController#publishWorkInProgress(UUID, Long, OAuth2AuthenticatedPrincipal)}
     * aufgerufen, um die Änderungen auf das Angebot zu übertragen.
     */
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    @PutMapping("/{bestPractiseId}")
    BestPractiseWorkInProgressResponseDto updateBestPractise(@PathVariable("orgId") Long orgId,
                                                             @PathVariable("bestPractiseId") Long bestPractiseId,
                                                             @AuthenticationPrincipal
                                                             OAuth2AuthenticatedPrincipal principal) {

        final BestPractise bestPractise = marketplaceService.findMarketplaceItemById(bestPractiseId)
                .filter(item -> item instanceof BestPractise)
                .map(item -> (BestPractise) item)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "BestPractise", bestPractiseId)));
        final Organisation organisation = Objects.requireNonNull(bestPractise.getOrganisation());
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress bestPractiseWorkInProgress =
                marketplaceMapper.mapBestPractiseToWorkInProgress(bestPractise);
        final BestPractiseWorkInProgress savedBestPractise =
                marketplaceWorkInProgressService.save(bestPractiseWorkInProgress);
        return marketplaceMapper.mapBestPractiseWorkInProgress(savedBestPractise);
    }

    /**
     * Aktualisiert des Status eines Praxisbeispiels.
     */
    @RolesAllowed(PermissionPool.OFFER_CHANGE)
    @PutMapping("/{bestPractiseId}/status")
    BestPractiseResponseDto setBestPractiseStatus(@PathVariable("orgId") Long orgId,
                                                  @PathVariable("bestPractiseId") Long bestPractiseId,
                                                  @RequestBody @Validated ItemStatusChangeDto itemStatusChangeDto,
                                                  @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final BestPractise bestPractise = marketplaceService.findMarketplaceItemById(bestPractiseId)
                .filter(item -> item instanceof BestPractise)
                .map(item -> (BestPractise) item)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "BestPractise", bestPractiseId)));
        final Organisation organisation = Objects.requireNonNull(bestPractise.getOrganisation());
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final BestPractise savedBestPractise;
        if (!Objects.equals(bestPractise.getStatus(), itemStatusChangeDto.getStatus())) {
            bestPractise.setStatus(itemStatusChangeDto.getStatus());
            savedBestPractise = marketplaceService.save(bestPractise);
        } else {
            savedBestPractise = bestPractise;
        }

        return marketplaceMapper.mapBestPractiseToResponseDto(savedBestPractise);
    }

    /**
     * Löscht ein Praxisbeispiel.
     */
    @DeleteMapping("{bestPractiseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public void deleteOfferById(@PathVariable("orgId") Long orgId,
                                @PathVariable("bestPractiseId") Long bestPractiseId,
                                @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) throws IOException {
        final MarketplaceItem marketplaceItem = marketplaceService.findMarketplaceItemById(bestPractiseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        final Organisation organisation = Objects.requireNonNull(marketplaceItem.getOrganisation());
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        marketplaceService.deleteMarketplaceItem(marketplaceItem);
    }

}
