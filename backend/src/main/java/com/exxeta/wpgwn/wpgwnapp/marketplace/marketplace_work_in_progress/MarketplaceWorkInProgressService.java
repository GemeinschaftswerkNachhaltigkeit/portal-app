package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress;

import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.MarketplaceWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.QMarketplaceWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;

import com.querydsl.core.types.Predicate;

@RequiredArgsConstructor
@Slf4j
@Service
public class MarketplaceWorkInProgressService {

    private final MarketPlaceWorkInProgressRepository marketPlaceWorkInProgressRepository;

    private final FileStorageService fileStorageService;

    public OfferWorkInProgress save(OfferWorkInProgress offerWorkInProgress) {
        return marketPlaceWorkInProgressRepository.save(offerWorkInProgress);
    }

    public BestPractiseWorkInProgress save(BestPractiseWorkInProgress bestPractiseWorkInProgress) {
        return marketPlaceWorkInProgressRepository.save(bestPractiseWorkInProgress);
    }

    public Page<BestPractiseWorkInProgress> findBestPractiseItems(Long orgId, Pageable pageable) {
        Predicate predicate =
                QMarketplaceWorkInProgress.marketplaceWorkInProgress.marketplaceType.eq(MarketplaceType.BEST_PRACTISE)
                        .and(QMarketplaceWorkInProgress.marketplaceWorkInProgress.organisation.id.eq(orgId));
        return marketPlaceWorkInProgressRepository.findAll(predicate, pageable)
                .map(item -> (BestPractiseWorkInProgress) item);
    }

    public Page<OfferWorkInProgress> findOfferWorkInProgressItems(Long orgId, Pageable pageable) {
        Predicate predicate =
                QMarketplaceWorkInProgress.marketplaceWorkInProgress.marketplaceType.eq(MarketplaceType.OFFER)
                        .and(QMarketplaceWorkInProgress.marketplaceWorkInProgress.organisation.id.eq(orgId));
        return marketPlaceWorkInProgressRepository.findAll(predicate, pageable)
                .map(item -> (OfferWorkInProgress) item);
    }

    public MarketplaceWorkInProgress saveOfferImage(MarketplaceWorkInProgress marketplaceWorkInProgress,
                                                    MultipartFile file)
            throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final String image = marketplaceWorkInProgress.getImage();

        if (!Objects.equals(Optional.of(marketplaceWorkInProgress)
                .map(MarketplaceWorkInProgress::getMarketplaceItem)
                .map(MarketplaceItem::getImage).orElse(null), image)) {
            fileStorageService.deleteFileIfPresent(image);
        }

        marketplaceWorkInProgress.setImage(filename);
        return marketPlaceWorkInProgressRepository.save(marketplaceWorkInProgress);
    }

    /**
     * Löscht das am Angebot verlinkte Bild. Wichtig: Darf nur gelöscht werden, wenn das Angebot Wip vom Nutzer
     * gelöscht wird und nicht, wenn es in ein Angebot umgewandelt wurde.
     *
     * @param marketplaceWorkInProgress
     * @return
     * @throws IOException
     */
    public MarketplaceWorkInProgress deleteOfferImage(MarketplaceWorkInProgress marketplaceWorkInProgress)
            throws IOException {
        final String image = marketplaceWorkInProgress.getImage();

        if (!Objects.equals(Optional.of(marketplaceWorkInProgress)
                .map(MarketplaceWorkInProgress::getMarketplaceItem)
                .map(MarketplaceItem::getImage).orElse(null), image)) {
            fileStorageService.deleteFileIfPresent(image);
        }

        marketplaceWorkInProgress.setImage(null);
        return marketPlaceWorkInProgressRepository.save(marketplaceWorkInProgress);
    }

    public void deleteOfferWorkInProgress(@NonNull MarketplaceWorkInProgress offerWorkInProgress) {
        marketPlaceWorkInProgressRepository.delete(offerWorkInProgress);
    }

    public OfferWorkInProgress getOfferWorkInProgressByRandomUniqueId(UUID offerRandomUniqueId) {
        return marketPlaceWorkInProgressRepository.findByRandomUniqueId(offerRandomUniqueId)
                .filter(marketplaceItem -> marketplaceItem instanceof OfferWorkInProgress)
                .map(marketPlaceWorkInProgress -> (OfferWorkInProgress) marketPlaceWorkInProgress)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "OfferWorkInProgress",
                                offerRandomUniqueId)));
    }

    public BestPractiseWorkInProgress getBestPractiseWorkInProgressByRandomUniqueId(UUID offerRandomUniqueId) {
        return marketPlaceWorkInProgressRepository.findByRandomUniqueId(offerRandomUniqueId)
                .filter(marketplaceItem -> marketplaceItem instanceof BestPractiseWorkInProgress)
                .map(marketPlaceWorkInProgress -> (BestPractiseWorkInProgress) marketPlaceWorkInProgress)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "BestPractiseWorkInProgress",
                                offerRandomUniqueId)));
    }

    public Optional<MarketplaceWorkInProgress> findByRandomUniqueId(UUID offerRandomUniqueId) {
        return marketPlaceWorkInProgressRepository.findByRandomUniqueId(offerRandomUniqueId);
    }
}
