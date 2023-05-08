package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace;

import java.io.IOException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QMarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final MarketplaceRepository marketplaceRepository;

    private final MarketplaceValidator marketplaceValidator;

    private final FileStorageService fileStorageService;


    public <T extends MarketplaceItem> T save(T marketplaceItem) {
        marketplaceValidator.validateMarketplaceItem(marketplaceItem);
        marketplaceValidator.validateMaxItemNumber(marketplaceItem);

        return marketplaceRepository.save(marketplaceItem);
    }

    public Optional<MarketplaceItem> findMarketplaceItemById(Long offerId) {
        return marketplaceRepository.findById(offerId);
    }

    private MarketplaceItem deleteMarketplaceImage(MarketplaceItem marketplaceItem) throws IOException {
        final String image = marketplaceItem.getImage();
        fileStorageService.deleteFileIfPresent(image);
        marketplaceItem.setImage(null);
        return marketplaceRepository.save(marketplaceItem);
    }

    public void deleteMarketplaceItem(@NonNull MarketplaceItem marketplaceItem) throws IOException {
        deleteMarketplaceImage(marketplaceItem);
        marketplaceRepository.delete(marketplaceItem);
    }

    public Page<MarketplaceItem> findMarketplaceItemsByOrganisationId(Long orgId, Pageable pageable) {
        return marketplaceRepository.findAllByOrganisationIdIs(orgId, pageable);
    }

    public Page<Offer> findOffersByOrganisationId(Long orgId, boolean onlyActive, Pageable pageable) {
        BooleanExpression predicate = QMarketplaceItem.marketplaceItem.organisation.id.eq(orgId)
                .and(QMarketplaceItem.marketplaceItem.marketplaceType.eq(MarketplaceType.OFFER));
        if (onlyActive) {
            predicate = predicate.and(QMarketplaceItem.marketplaceItem.status.eq(ItemStatus.ACTIVE));
        }

        return marketplaceRepository.findAll(predicate, pageable)
                .map(item -> (Offer) item);
    }

    public Page<BestPractise> findBestPractiseByOrganisationId(Long orgId, boolean onlyActive, Pageable pageable) {
        BooleanExpression predicate = QMarketplaceItem.marketplaceItem.organisation.id.eq(orgId)
                .and(QMarketplaceItem.marketplaceItem.marketplaceType.eq(MarketplaceType.BEST_PRACTISE));
        if (onlyActive) {
            predicate = predicate.and(QMarketplaceItem.marketplaceItem.status.eq(ItemStatus.ACTIVE));
        }
        return marketplaceRepository.findAll(predicate, pageable)
                .map(item -> (BestPractise) item);
    }

    public Page<MarketplaceItem> findMarketplaceItems(Predicate offerPredicate, Pageable pageable) {
        return marketplaceRepository.findAll(offerPredicate, pageable);
    }

    public void deleteMarketplaceItems(Organisation organisation) {

        marketplaceRepository.findAllByOrganisation(organisation)
                .forEach(marketplaceItem -> {
                    try {
                        deleteMarketplaceImage(marketplaceItem);
                    } catch (IOException e) {
                        log.warn("Unexpected error while trying to delete market place items image", e);
                    }
                    marketplaceRepository.delete(marketplaceItem);
                });
    }
}
