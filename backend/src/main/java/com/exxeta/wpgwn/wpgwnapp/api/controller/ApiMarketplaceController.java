package com.exxeta.wpgwn.wpgwnapp.api.controller;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiMarketplaceResponseDto;
import com.exxeta.wpgwn.wpgwnapp.api.mapper.ApiMarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.exception.ErrorResponse;
import com.exxeta.wpgwn.wpgwnapp.hibernate.FullTextSearchHelper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.controller.MarketplaceBindingCustomizer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QMarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.data.web.PageableDefault;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;

import static com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.controller.MarketplaceController.MARKETPLACE_PAGE_SIZE;

@RestController
@RequestMapping("/openapi/v1/marketplace")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "marketplaces", description = "Find marketplace.")
@SecurityRequirement(name = "api-key")
@RolesAllowed(PermissionPool.API)
public class ApiMarketplaceController {

    private final ApiMarketplaceMapper marketplaceMapper;

    private final MarketplaceService marketplaceService;

    private final FullTextSearchHelper fullTextSearchHelper;

    @Operation(summary = "Get a page of marketplace items")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "A page with  marketplace items"),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid")
    })
    @GetMapping
    public Page<ApiMarketplaceResponseDto> findMarketplaceItems(
            @Parameter(description = "Search marketplace items by name and description. Search is case insensitive.")
            @RequestParam(value = "query", required = false) String query,
            @QuerydslPredicate(root = MarketplaceItem.class, bindings = MarketplaceBindingCustomizer.class)
            Predicate offerPredicate,
            @PageableDefault(size = MARKETPLACE_PAGE_SIZE, sort = "modifiedAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        BooleanBuilder searchPredicate = new BooleanBuilder(offerPredicate)
                .and(QMarketplaceItem.marketplaceItem.status.eq(ItemStatus.ACTIVE));

        if (StringUtils.hasText(query)) {
            final String queryWithOr = String.join(" OR ", query.split(" "));
            BooleanExpression searchFieldsForQuery = inNameOrDescription(queryWithOr);
            searchPredicate.and(searchFieldsForQuery);
        }

        return marketplaceService.findMarketplaceItems(searchPredicate, pageable)
                .map(marketplaceMapper::mapMarketplaceItemToResponseDto);
    }

    @Operation(summary = "Get an marketplace item by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the marketplace item",
                    content = {@Content(mediaType = "application/json"
                    )}),
            @ApiResponse(responseCode = "400", description = "Invalid marketplace item id supplied",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid"),
            @ApiResponse(responseCode = "404", description = "Marketplace item not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("{marketplaceItemId}")
    public ApiMarketplaceResponseDto getMarketplaceItemById(
            @PathVariable("marketplaceItemId") Long marketplaceItemId) {
        final MarketplaceItem marketplaceItem = marketplaceService.findMarketplaceItemById(marketplaceItemId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "MarketplaceItem", marketplaceItemId)));
        return marketplaceMapper.mapMarketplaceItemToResponseDto(marketplaceItem);
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
}
