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
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.OfferResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.OfferResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.MarketplaceWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.OfferWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.OfferWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

/**
 * Endpunkt zum Abrufen, Anlegen, Aktualisieren und L??schen von Marktplatzangeboten.
 * F??r ein vorhandenes Angebot wird ein Work-in-progress Objekt erstellt,
 *  dass bearbeitet werden kann. Anschlie??end k??nnen die ??nderungen ver??ffentlicht werden.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/marketplace/offer")
@RequiredArgsConstructor
public class OfferController {

    private final OrganisationService organisationService;

    private final OrganisationValidator organisationValidator;

    private final MarketplaceMapper marketplaceMapper;

    private final MarketplaceService marketplaceService;

    private final MarketplaceWorkInProgressService marketplaceWorkInProgressService;

    private final OfferWorkInProgressMapper offerWorkInProgressMapper;

    private final Clock clock;

    /**
     * Abrufen von Angeboten einer Organisation. Keine Authentifizierung erforderlich.
     *
     * @param orgId
     * @param pageable
     * @return
     */
    @GetMapping
    public Page<OfferResponseDto> getMarketplaceItemsByOrganisationId(
            @PathVariable("orgId") Long orgId, Pageable pageable) {
        return marketplaceService.findOffersByOrganisationId(orgId, pageable)
                .map(marketplaceMapper::mapOfferToDetailsDto);
    }

    /**
     * Abrufen der Detailinformationen f??r ein Angebot. Keine Authentifizierung erforderlich.
     */
    @GetMapping("{offerId}")
    public OfferResponseDetailsDto getMarketplaceItemById(@PathVariable("orgId") Long orgId,
                                                          @PathVariable("offerId") Long offerId) {
        final Offer offer = marketplaceService.findMarketplaceItemById(offerId)
                .filter(item -> item instanceof Offer)
                .filter(item -> Objects.equals(item.getOrganisation().getId(), orgId))
                .map(item -> (Offer) item)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Offer", offerId)));
        return marketplaceMapper.mapOfferToResponseDetailsDto(offer);
    }

    /**
     * Anlegen eines neuen "leeren" Angebots, das einer Organisation zugeordnet ist.
     * Ben??tigt Rechte zum ??ndern von Marktplatzangeboten.
     */
    @PostMapping
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    OfferWorkInProgressResponseDto createOfferWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.hasPermissionForOrganisation(principal, organisation);

        final OfferWorkInProgress offerWorkInProgress = new OfferWorkInProgress();
        offerWorkInProgress.setOrganisation(organisation);
        offerWorkInProgress.setMarketplaceType(MarketplaceType.OFFER);
        offerWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        offerWorkInProgress.setRandomIdGenerationTime(Instant.now(clock));
        final OfferWorkInProgress savedOffer = marketplaceWorkInProgressService.save(offerWorkInProgress);
        return offerWorkInProgressMapper.mapOfferWorkInProgress(savedOffer);
    }

    /**
     * Endpunkt zum Aktualisieren eines Angebots.
     * Aus dem Angebot wird ein {@link OfferWorkInProgress} erstellt, das bearbeitet wird.
     * Am Ende der Bearbeitung wird der Endpunkt
     * {@link com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.controller.OfferWorkInProgressController#publishOfferWorkInProgress(UUID, Long, OAuth2AuthenticatedPrincipal)}
     * aufgerufen, um die ??nderungen auf das Angebot zu ??bertragen.
     */
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    @PutMapping("/{offerId}")
    OfferWorkInProgressResponseDto updateBestPractise(@PathVariable("orgId") Long orgId,
                                                      @PathVariable("offerId") Long offerId,
                                                      @AuthenticationPrincipal
                                                      OAuth2AuthenticatedPrincipal principal) {

        final Offer marketplaceItem = marketplaceService.findMarketplaceItemById(offerId)
                .filter(item -> item instanceof Offer)
                .map(item -> (Offer) item)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "Offer", offerId)));
        final Organisation organisation = Objects.requireNonNull(marketplaceItem.getOrganisation());
        organisationValidator.hasPermissionForOrganisation(principal, organisation);

        final OfferWorkInProgress offerWorkInProgress = marketplaceMapper.mapOfferToWorkInProgress(marketplaceItem);

        final OfferWorkInProgress savedOfferWorkInProgress = marketplaceWorkInProgressService.save(offerWorkInProgress);
        return offerWorkInProgressMapper.mapOfferWorkInProgress(savedOfferWorkInProgress);
    }


    /**
     * L??scht ein Angebot.
     */
    @DeleteMapping("{offerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public void deleteOfferById(@PathVariable("orgId") Long orgId,
                                @PathVariable("offerId") Long offerId,
                                @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) throws IOException {
        final MarketplaceItem marketplaceItem = marketplaceService.findMarketplaceItemById(offerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        final Organisation organisation = Objects.requireNonNull(marketplaceItem.getOrganisation());
        organisationValidator.hasPermissionForOrganisation(principal, organisation);
        marketplaceService.deleteMarketplaceItem(marketplaceItem);
    }

}
