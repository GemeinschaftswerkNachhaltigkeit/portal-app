package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.MarketplaceWorkInProgress;

public interface MarketPlaceWorkInProgressRepository extends JpaRepository<MarketplaceWorkInProgress, Long>,
        RevisionRepository<MarketplaceWorkInProgress, Long, Long>,
        QuerydslPredicateExecutor<MarketplaceWorkInProgress> {

    @Transactional(readOnly = true)
    Page<MarketplaceWorkInProgress> findAllByOrganisationIdIs(Long organisationId, Pageable pageable);

    @Transactional(readOnly = true)
    Optional<MarketplaceWorkInProgress> findByRandomUniqueId(UUID offerRandomUniqueId);

}
