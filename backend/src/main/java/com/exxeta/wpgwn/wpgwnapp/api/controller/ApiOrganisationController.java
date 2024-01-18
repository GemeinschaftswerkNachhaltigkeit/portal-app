package com.exxeta.wpgwn.wpgwnapp.api.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.persistence.EntityNotFoundException;

import java.util.Objects;

import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiOrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.api.mapper.ApiOrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.exception.ErrorResponse;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationBindingCustomizer;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.QOrganisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

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

@RestController
@RequestMapping("/openapi/v1/organisations")
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Tag(name = "organisations", description = "Find organisations.")
@SecurityRequirement(name = "api-key")
@RolesAllowed(PermissionPool.API)
public class ApiOrganisationController {

    private final OrganisationService organisationService;

    private final GeometryFactory factory;

    private final ApiOrganisationMapper organisationMapper;

    @Operation(summary = "Get a page of organisations")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "A page with organisations"),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid")
    })
    @GetMapping
    public Page<ApiOrganisationResponseDto> getPagedOrganisation(
            @Parameter(description = "Filter organisations by location. String with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format.",
                    example = "-3.62,47.57,15.74,54.55")
            @RequestParam(value = "envelope", required = false) Envelope envelope,
            @Parameter(description = "Search organisations by name and description. Search is case insensitive.")
            @RequestParam(value = "query", required = false) String query,
            @ParameterObject
            @QuerydslPredicate(root = Organisation.class, bindings = OrganisationBindingCustomizer.class)
            Predicate filterPredicate,
            @ParameterObject Pageable pageable) {

        final BooleanBuilder searchPredicate = new BooleanBuilder(filterPredicate);
        if (Objects.nonNull(envelope)) {
            searchPredicate.and(QOrganisation.organisation.location.coordinate
                    .within(factory.toGeometry(envelope)));
        }

        if (StringUtils.hasText(query)) {
            BooleanExpression searchFieldsForQuery = QOrganisation.organisation.name.containsIgnoreCase(query)
                    .or(QOrganisation.organisation.description.containsIgnoreCase(query));
            searchPredicate.and(searchFieldsForQuery);
        }

        final Page<Organisation> organisationPage = organisationService.findAll(searchPredicate, pageable);
        return organisationPage.map(organisationMapper::organisationToDto);
    }

    @Operation(summary = "Get an organisation by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the organisation",
                    content = {@Content(mediaType = "application/json"
                    )}),
            @ApiResponse(responseCode = "400", description = "Invalid organisation id supplied",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid"),
            @ApiResponse(responseCode = "404", description = "Organisation not found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{orgId}")
    public ApiOrganisationResponseDto getOrganisationDetails(
            @Parameter(description = "Id of the organisation") @PathVariable("orgId")
            Long organisationId) {
        return organisationService.findById(organisationId)
                .map(organisationMapper::organisationToDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Organisation", organisationId)));
    }

}
