package com.exxeta.wpgwn.wpgwnapp.api.controller;

import jakarta.annotation.security.RolesAllowed;
import java.util.List;

import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.api.mapper.ApiActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.exception.ErrorResponse;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller für Aktivitäten einer Organisation.
 */
@RestController
@RequestMapping("/openapi/v1/organisations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "organisation-activities", description = "Find activities by organisation.")
@SecurityRequirement(name = "api-key")
@RolesAllowed(PermissionPool.API)
public class ApiOrganisationActivitiesController {

    private final ActivityRepository activityRepository;

    private final ApiActivityMapper activityMapper;

    @Operation(summary = "Get a page of activities of an organisation by its organisation id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the organisation",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiActivityResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid organisation id supplied",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid")
    })
    @GetMapping("/{orgId}/activities")
    Page<ApiActivityResponseDto> findActivitiesForOrganisation(
            @Parameter(description = "Id of the organisation") @PathVariable("orgId")
            Long orgId,
            @ParameterObject Pageable pageable) {
        List<String> defaultTypes = List.of(ActivityType.EVENT.name(), ActivityType.DAN.name());
        return activityRepository.findAllInActivityTypesAndByOrganisationId(defaultTypes, orgId, pageable)
                .map(activityMapper::activityToDto);
    }

}

