package com.exxeta.wpgwn.wpgwnapp.api.controller;

import javax.annotation.security.RolesAllowed;

import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.api.mapper.ApiActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/openapi/v1/activities")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "activities", description = "Find activities.")
@SecurityRequirement(name = "api-key")
@RolesAllowed(PermissionPool.API)
public class ApiActivitiesController {

    private final ActivityRepository activityRepository;

    private final ApiActivityMapper activityMapper;

    @Operation(summary = "Get a page of activities.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found activities",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiActivityResponseDto.class))}),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid")
    })
    @GetMapping
    Page<ApiActivityResponseDto> findActivitiesForOrganisation(@ParameterObject Pageable pageable) {
        return activityRepository.findAll(pageable)
                .map(activityMapper::activityToDto);
    }

}

