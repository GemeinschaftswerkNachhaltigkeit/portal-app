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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.MarketplaceWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.OfferWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.BestPractiseWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

/**
 * Endpunkt zum Abrufen, Anlegen, Aktualisieren und L??schen von Praxisberichten.
 * F??r einen vorhandenen Praxisbericht wird ein Work-in-progress Objekt erstellt,
 * dass bearbeitet werden kann. Anschlie??end k??nnen die ??nderungen ver??ffentlicht werden.
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

    private final OfferWorkInProgressMapper offerWorkInProgressMapper;

    private final Clock clock;

    /**
     * Abrufen der Praxisbeispiele f??r eine Organisation. Keine Authentifizierung erforderlich.
     */
    @GetMapping
    public Page<BestPractiseResponseDto> getBestPractiseItems(@PathVariable("orgId") Long orgId, Pageable pageable) {
        return marketplaceService.findBestPractiseByOrganisationId(orgId, pageable)
                .map(marketplaceMapper::mapBestPractiseToResponseDto);
    }

    /**
     * Abrufen der Detailinformationen f??r ein Praxisbeispiel. Keine Authentifizierung erforderlich.
     */
    @GetMapping("{offerId}")
    public BestPractiseResponseDetailsDto getMarketplaceItemById(@PathVariable("orgId") Long orgId,
                                                                 @PathVariable("offerId") Long offerId) {
        final BestPractise bestPractise = marketplaceService.findMarketplaceItemById(offerId)
                .filter(item -> item instanceof BestPractise)
                .filter(item -> Objects.equals(item.getOrganisation().getId(), orgId))
                .map(item -> (BestPractise) item)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Offer", offerId)));
        return marketplaceMapper.mapBestPractiseToResponseDetailsDto(bestPractise);
    }

    /**
     * Anlegen eines neuen "leeren" Praxisbeispiels, das einer Organisation zugeordnet ist.
     * Ben??tigt Rechte zum ??ndern von Marktplatzangeboten.
     */
    @PostMapping
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public BestPractiseWorkInProgressResponseDto createOfferWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.hasPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress bestPractiseWorkInProgress = new BestPractiseWorkInProgress();
        bestPractiseWorkInProgress.setOrganisation(organisation);
        bestPractiseWorkInProgress.setMarketplaceType(MarketplaceType.BEST_PRACTISE);
        bestPractiseWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        bestPractiseWorkInProgress.setRandomIdGenerationTime(Instant.now(clock));
        final BestPractiseWorkInProgress savedOffer = marketplaceWorkInProgressService.save(bestPractiseWorkInProgress);
        return offerWorkInProgressMapper.mapBestPractiseWorkInProgress(savedOffer);
    }

    /**
     * Endpunkt zum Aktualisieren eines Angebots.
     * Aus dem Angebot wird ein {@link OfferWorkInProgress} erstellt, das bearbeitet wird.
     * Am Ende der Bearbeitung wird der Endpunkt
     * {@link com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.controller.BestPracticeWorkInProgressController#publishWorkInProgress(UUID, Long, OAuth2AuthenticatedPrincipal)}
     * aufgerufen, um die ??nderungen auf das Angebot zu ??bertragen.
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
                        String.format("Entity [%s] with uuid [%s] not found", "Offer", bestPractiseId)));
        final Organisation organisation = Objects.requireNonNull(bestPractise.getOrganisation());
        organisationValidator.hasPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress bestPractiseWorkInProgress =
                marketplaceMapper.mapBestPractiseToWorkInProgress(bestPractise);
        final BestPractiseWorkInProgress savedOfferWorkInProgress =
                marketplaceWorkInProgressService.save(bestPractiseWorkInProgress);
        return offerWorkInProgressMapper.mapBestPractiseWorkInProgress(savedOfferWorkInProgress);
    }

    /**
     * L??scht ein Praxisbeispiel.
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
        organisationValidator.hasPermissionForOrganisation(principal, organisation);
        marketplaceService.deleteMarketplaceItem(marketplaceItem);
    }

}
