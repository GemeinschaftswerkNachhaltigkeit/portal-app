package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.controller;

import jakarta.annotation.security.RolesAllowed;
import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.files.FileUploadDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.MarketplaceWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.MarketplaceWorkInProgressValidator;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.OfferWorkInProgressPublishService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.BestPractiseWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.BestPractiseWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.MarketplaceWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

/**
 * Controller zum Erstellen, Bearbeiten und Veröffentlichen von Praxisberichten (Work-in-progress).
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/marketplace-wip/best-practise")
@RequiredArgsConstructor
public class BestPracticeWorkInProgressController {

    private final OrganisationService organisationService;

    private final OrganisationValidator organisationValidator;

    private final MarketplaceMapper marketplaceMapper;

    private final MarketplaceWorkInProgressService marketplaceWorkInProgressService;

    private final OfferWorkInProgressPublishService offerWorkInProgressPublishService;

    private final MarketplaceWorkInProgressValidator offerValidator;


    @GetMapping
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public Page<BestPractiseWorkInProgressResponseDto> getBestPractiseItems(
            @PathVariable("orgId") Long orgId,
            Pageable pageable,
            @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        return marketplaceWorkInProgressService.findBestPractiseItems(orgId, pageable)
                .map(marketplaceMapper::mapBestPractiseWorkInProgress);
    }

    @GetMapping("{randomUniqueId}")
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public BestPractiseWorkInProgressResponseDto getMarketPlaceItemById(
            @PathVariable("orgId") Long orgId,
            @PathVariable("randomUniqueId") UUID randomUniqueId,
            @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress offerWip =
                marketplaceWorkInProgressService.getBestPractiseWorkInProgressByRandomUniqueId(randomUniqueId);

        offerValidator.validateSameOrganisation(offerWip, organisation);
        return marketplaceMapper.mapBestPractiseWorkInProgress(offerWip);
    }

    @PutMapping("{randomUniqueId}")
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public BestPractiseWorkInProgressResponseDto updateBestPractise(
            @PathVariable("orgId") Long orgId,
            @PathVariable("randomUniqueId") UUID randomUniqueId,
            @RequestBody @Validated BestPractiseWorkInProgressRequestDto offerRequest,
            @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress bestPractiseWorkInProgress =
                marketplaceWorkInProgressService.getBestPractiseWorkInProgressByRandomUniqueId(randomUniqueId);

        offerValidator.validateSameOrganisation(bestPractiseWorkInProgress, organisation);
        marketplaceMapper.updateBestPractise(offerRequest, bestPractiseWorkInProgress);

        final BestPractiseWorkInProgress savedOffer = marketplaceWorkInProgressService.save(bestPractiseWorkInProgress);
        return marketplaceMapper.mapBestPractiseWorkInProgress(savedOffer);
    }

    @DeleteMapping("{randomUniqueId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    public void deleteOfferWorkInProgressByUuid(@PathVariable("orgId") Long orgId,
                                                @PathVariable("randomUniqueId") UUID randomUniqueId,
                                                @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal)
            throws IOException {
        final BestPractiseWorkInProgress offerWip =
                marketplaceWorkInProgressService.findByRandomUniqueId(randomUniqueId)
                        .filter(marketplaceItem -> marketplaceItem instanceof BestPractiseWorkInProgress)
                        .map(marketPlaceWorkInProgress -> (BestPractiseWorkInProgress) marketPlaceWorkInProgress)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        final Organisation organisation = organisationService.findById(orgId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        offerValidator.validateSameOrganisation(offerWip, organisation);
        marketplaceWorkInProgressService.deleteOfferImage(offerWip);
        marketplaceWorkInProgressService.deleteOfferWorkInProgress(offerWip);
    }

    /**
     * Endpunkt zum Veröffentlichen von Marktplatzangeboten die im Arbeitsstadium sind.
     */
    @PostMapping("/{randomUniqueId}/releases")
    @RolesAllowed({PermissionPool.OFFER_PUBLISH, PermissionPool.RNE_ADMIN})
    public BestPractiseResponseDto publishWorkInProgress(@PathVariable("randomUniqueId") UUID randomUniqueId,
                                                         @PathVariable("orgId") Long orgId,
                                                         @AuthenticationPrincipal
                                                         OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress workInProgress =
                marketplaceWorkInProgressService.getBestPractiseWorkInProgressByRandomUniqueId(randomUniqueId);
        final BestPractise savedMarketplaceItem = offerWorkInProgressPublishService
                .updateBestPractiseWithWorkInProgress(workInProgress, principal);

        marketplaceWorkInProgressService.deleteOfferWorkInProgress(workInProgress);
        return marketplaceMapper.mapBestPractiseToResponseDto(savedMarketplaceItem);
    }

    //    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    @PutMapping("/{randomUniqueId}/image")
    public FileUploadDto updateOfferImage(@PathVariable("orgId") Long orgId,
                                          @PathVariable("randomUniqueId") UUID randomUniqueId,
                                          @RequestParam("file") MultipartFile file,
                                          @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal)
            throws IOException {

//        final Organisation organisation = organisationService.getOrganisation(orgId);
//        organisationValidator.hasPermissionForOrganisation(principal, organisation);

        final BestPractiseWorkInProgress offerWip =
                marketplaceWorkInProgressService.getBestPractiseWorkInProgressByRandomUniqueId(randomUniqueId);
        final MarketplaceWorkInProgress savedOfferWip = marketplaceWorkInProgressService.saveOfferImage(offerWip, file);
        return new FileUploadDto(savedOfferWip.getImage());
    }

    //    @RolesAllowed({PermissionPool.OFFER_CHANGE, PermissionPool.RNE_ADMIN})
    @DeleteMapping("/{randomUniqueId}/image")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOfferImage(@PathVariable("orgId") Long orgId,
                                 @PathVariable("randomUniqueId") UUID randomUniqueId,
                                 @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal)
            throws IOException {

//        final Organisation organisation = organisationService.getOrganisation(orgId);
//        organisationValidator.hasPermissionForOrganisation(principal, organisation);

        final MarketplaceWorkInProgress offer =
                marketplaceWorkInProgressService.getBestPractiseWorkInProgressByRandomUniqueId(randomUniqueId);
        marketplaceWorkInProgressService.deleteOfferImage(offer);
    }


}
