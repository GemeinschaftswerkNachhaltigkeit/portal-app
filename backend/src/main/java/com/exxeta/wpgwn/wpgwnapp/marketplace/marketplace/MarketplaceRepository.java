package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace;

import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

public interface MarketplaceRepository extends JpaRepository<MarketplaceItem, Long>,
        RevisionRepository<MarketplaceItem, Long, Long>,
        QuerydslPredicateExecutor<MarketplaceItem> {

    @Transactional(readOnly = true)
    Page<MarketplaceItem> findAllByOrganisationIdIs(Long organisationId, Pageable pageable);

    @Transactional(readOnly = true)
    long countMarketplaceItemsByOrganisationAndMarketplaceTypeAndStatus(Organisation organisation, MarketplaceType type,
                                                                        ItemStatus status);

    @Transactional(readOnly = true)
    Stream<MarketplaceItem> findAllByOrganisation(Organisation organisation);
}
