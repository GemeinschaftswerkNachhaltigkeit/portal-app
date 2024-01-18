package com.exxeta.wpgwn.wpgwnapp.api.controller;

import jakarta.annotation.security.RolesAllowed;
import java.util.List;

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
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;

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
    Page<ApiActivityResponseDto> findActivities(@ParameterObject Pageable pageable) {
        return findActivitiesByType(List.of(ActivityType.EVENT.name(), ActivityType.DAN.name()), pageable);
    }

    @Operation(summary = "Get a page of event.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found events",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiActivityResponseDto.class))}),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid")
    })
    @GetMapping("/events")
    Page<ApiActivityResponseDto> findEvents(@ParameterObject Pageable pageable) {
        return findActivitiesByType(List.of(ActivityType.EVENT.name()), pageable);
    }

    @Operation(summary = "Get a page of dan.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found dans",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiActivityResponseDto.class))}),
            @ApiResponse(responseCode = "401", description = "Authorization header is missing or api key is invalid")
    })
    @GetMapping("/dans")
    Page<ApiActivityResponseDto> findDans(@ParameterObject Pageable pageable) {
        return findActivitiesByType(List.of(ActivityType.DAN.name()), pageable);
    }

    private Page<ApiActivityResponseDto> findActivitiesByType(List<String> defaultTypes, Pageable pageable) {
        return activityRepository.findAllInActivityTypes(defaultTypes, pageable)
                .map(activityMapper::activityToDto);
    }


}

