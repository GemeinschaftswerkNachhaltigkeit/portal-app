package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.event.MarketplaceUpdateEvent;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.FeaturedValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfferWorkInProgressPublishService {

    private final OrganisationValidator organisationValidator;

    private final FeaturedValidator featuredValidator;

    private final MarketplaceService marketplaceService;

    private final MarketplaceMapper marketplaceMapper;

    private final FileStorageService fileStorageService;

    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public BestPractise updateBestPractiseWithWorkInProgress(BestPractiseWorkInProgress workInProgress,
                                                             OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = Objects.requireNonNull(workInProgress.getOrganisation());
        final BestPractise bestPractise = Optional.ofNullable(workInProgress.getMarketplaceItem())
                .filter(item -> item instanceof BestPractise)
                .map(item -> (BestPractise) item)
                .orElse(new BestPractise());

        final boolean imageHasChanged = !Objects.equals(workInProgress.getImage(), bestPractise.getImage());
        final String imagePath = bestPractise.getImage();

        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        marketplaceMapper.updateBestPractiseWithWorkInProgress(workInProgress, bestPractise);
        final BestPractise savedMarketplaceItem = marketplaceService.save(bestPractise);

        fileStorageService.deleteIfChanged(imageHasChanged, imagePath);
        applicationEventPublisher.publishEvent(new MarketplaceUpdateEvent(savedMarketplaceItem));
        return savedMarketplaceItem;
    }

    @Transactional
    public Offer updateOfferWithOfferWorkInProgress(OfferWorkInProgress workInProgress,
                                                    OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = Objects.requireNonNull(workInProgress.getOrganisation());
        final Offer offer = Optional.ofNullable(workInProgress.getMarketplaceItem())
                .filter(item -> item instanceof Offer)
                .map(item -> (Offer) item)
                .orElse(new Offer());

        final boolean imageHasChanged = !Objects.equals(workInProgress.getImage(), offer.getImage());
        final String imagePath = offer.getImage();

        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        featuredValidator.checkFeaturedPermission(principal, workInProgress);
        featuredValidator.checkFeaturedPermission(principal, offer);

        marketplaceMapper.updateOfferWithWorkInProgress(workInProgress, offer);
        final Offer savedMarketplaceItem = marketplaceService.save(offer);

        if (imageHasChanged) {
            try {
                fileStorageService.deleteFileIfPresent(imagePath);
            } catch (IOException e) {
                log.warn("Unexpected error deleting no longer needed image from best practise [{}]", imagePath);
            }
        }

        applicationEventPublisher.publishEvent(new MarketplaceUpdateEvent(savedMarketplaceItem));
        return savedMarketplaceItem;
    }

}
