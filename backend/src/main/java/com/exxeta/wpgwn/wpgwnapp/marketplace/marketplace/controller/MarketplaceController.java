package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.controller;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.data.web.PageableDefault;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.hibernate.FullTextSearchHelper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.MarketplaceResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.MarketplaceResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QBestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QMarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QOffer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQuery;

/**
 * Controller zum Abrufen von Marktplatzangeboten aller Typen (Angebote und Praxisberichte)
 * unabhängig von der Organisation.
 */
@RestController
@RequestMapping("/api/v1/marketplace")
@RequiredArgsConstructor
@Slf4j
public class MarketplaceController {

    public static final int MARKETPLACE_PAGE_SIZE = 20;
    private final MarketplaceMapper marketplaceMapper;

    private final MarketplaceService marketplaceService;

    private final FullTextSearchHelper fullTextSearchHelper;

    @PersistenceContext
    private final EntityManager entityManager;

    /**
     * Suchen von Angebote und Praxisbeispielen.
     */
    @GetMapping
    public Page<MarketplaceResponseDto> findMarketplaceItems(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "bestPractiseCat", required = false) Set<BestPractiseCategory> bestPractiseCategories,
            @RequestParam(value = "offerCat", required = false) Set<OfferCategory> offerCategories,
            @QuerydslPredicate(root = MarketplaceItem.class, bindings = MarketplaceBindingCustomizer.class)
            Predicate offerPredicate,
            @PageableDefault(size = MARKETPLACE_PAGE_SIZE, sort = "modifiedAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        BooleanBuilder searchPredicate = new BooleanBuilder(offerPredicate)
                .and(QMarketplaceItem.marketplaceItem.status.eq(ItemStatus.ACTIVE));

        if (StringUtils.hasText(query)) {
            final String queryWithOr = fullTextSearchHelper.splitQuery(query);
            BooleanExpression searchFieldsForQuery = inNameOrDescription(queryWithOr);
            searchFieldsForQuery = orInOfferCategory(queryWithOr, searchFieldsForQuery);
            searchFieldsForQuery = orInBestPractiseCategory(queryWithOr, searchFieldsForQuery);
            searchFieldsForQuery = fullTextSearchHelper.orInThematicFocus(queryWithOr, searchFieldsForQuery,
                    QMarketplaceItem.marketplaceItem.thematicFocus);

            searchPredicate.and(searchFieldsForQuery);
        }

        if (!CollectionUtils.isEmpty(offerCategories) || !CollectionUtils.isEmpty(bestPractiseCategories)) {
            BooleanBuilder categoryPredicate = new BooleanBuilder();

            if (!CollectionUtils.isEmpty(offerCategories)) {
                offerCategories.forEach(cat -> categoryPredicate
                        .or(QMarketplaceItem.marketplaceItem.as(QOffer.class).offerCategory.eq(cat)));

            }

            if (!CollectionUtils.isEmpty(bestPractiseCategories)) {
                bestPractiseCategories.forEach(cat -> categoryPredicate
                        .or(QMarketplaceItem.marketplaceItem.as(QBestPractise.class).bestPractiseCategory.eq(cat)));
            }

            searchPredicate.and(categoryPredicate);
        }

        JPAQuery<MarketplaceItem> jpaQuery = new JPAQuery<MarketplaceItem>(entityManager)
                .from(QMarketplaceItem.marketplaceItem)
                .where(searchPredicate);

        jpaQuery.orderBy(expiredExpression().asc())
                .orderBy(QMarketplaceItem.marketplaceItem.modifiedAt.desc())
                .orderBy(QMarketplaceItem.marketplaceItem.createdAt.desc());

        jpaQuery.offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        final Page<MarketplaceItem> marketplaceItemsPage =
                PageableExecutionUtils.getPage(jpaQuery.fetch(), pageable, jpaQuery::fetchCount);

        return marketplaceItemsPage.map(marketplaceMapper::mapMarketplaceItemToResponseDto);

    }

    @GetMapping("{marketplaceItemId}")
    public MarketplaceResponseDetailsDto getMarketplaceItemById(
            @PathVariable("marketplaceItemId") Long marketplaceItemId) {
        final MarketplaceItem marketplaceItem = marketplaceService.findMarketplaceItemById(marketplaceItemId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Offer", marketplaceItemId)));
        return marketplaceMapper.mapMarketplaceItemToDetailsDto(marketplaceItem);
    }

    private NumberTemplate<Integer> expiredExpression() {
        return Expressions.numberTemplate(Integer.class,
                "CASE WHEN {0} IS NOT NULL AND {0} <= current_date  THEN 1 ELSE 0 END",
                QMarketplaceItem.marketplaceItem.endUntil);
    }


    private BooleanExpression inNameOrDescription(String query) {
        BooleanExpression nameOrDescriptionQuery =
                fullTextSearchHelper.fullTextSearchInTsVector(QMarketplaceItem.marketplaceItem.nameTsVec, query)
                        .or(fullTextSearchHelper.fullTextSearchInTsVector(
                                QMarketplaceItem.marketplaceItem.descriptionTsVec, query));

        // Contains Suche im Fall eines Suchbegriffs.
        if (query.trim().split(" ").length == 1) {
            nameOrDescriptionQuery = nameOrDescriptionQuery
                    .or(QMarketplaceItem.marketplaceItem.name.containsIgnoreCase(query))
                    .or(QMarketplaceItem.marketplaceItem.description.containsIgnoreCase(query));
        }

        return nameOrDescriptionQuery;
    }

    private BooleanExpression orInOfferCategory(String query, BooleanExpression searchFieldsForQuery) {
        final Set<OfferCategory> offerCategories = fullTextSearchHelper.getMatchingValues(OfferCategory.class, query);
        if (!offerCategories.isEmpty()) {
            for (OfferCategory cat : offerCategories) {
                searchFieldsForQuery.or(QMarketplaceItem.marketplaceItem.as(QOffer.class).offerCategory.eq(cat));
            }
        }
        return searchFieldsForQuery;
    }

    private BooleanExpression orInBestPractiseCategory(String query, BooleanExpression searchFieldsForQuery) {
        final Set<BestPractiseCategory> bestPractiseCategories =
                fullTextSearchHelper.getMatchingValues(BestPractiseCategory.class, query);
        if (!bestPractiseCategories.isEmpty()) {
            for (BestPractiseCategory cat : bestPractiseCategories) {
                searchFieldsForQuery.or(
                        QMarketplaceItem.marketplaceItem.as(QBestPractise.class).bestPractiseCategory.eq(cat));
            }
        }
        return searchFieldsForQuery;
    }

}
