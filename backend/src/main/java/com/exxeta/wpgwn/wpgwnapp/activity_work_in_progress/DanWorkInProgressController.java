package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;


import javax.validation.Valid;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.activity.DanValidator;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.utils.PrincipalMapper;

import com.querydsl.core.types.Predicate;
import io.swagger.v3.oas.annotations.Parameter;

import static java.util.Objects.nonNull;

/**
 * Controller mit Endpunkten zum Verwalten von Dan-Arbeitsständen.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/dan-wip")
@RequiredArgsConstructor
@Transactional
public class DanWorkInProgressController {

    private final ActivityWorkInProgressMapper workInProgressMapper;

    private final ActivityMapper activityMapper;

    private final OrganisationService organisationService;

    private final ActivityWorkInProgressService activityWorkInProgressService;

    private final ActivityWorkInProgressPublishService activityWorkInProgressPublishService;

    private final DanValidator danValidator;

    private final WpgwnProperties wpgwnProperties;

    private final DanRangeService danRangeService;

    private final Clock clock;

    /**
     * Abrufen aller unvollständigen Dan (WIP) (Seitenweise) bei denen der eingeloggte
     * User der creator ist.
     *
     * @param principal
     * @return
     */
    @GetMapping
    Page<ActivityWorkInProgressResponseDto> getDansWorkInProgress(@PathVariable("orgId") Long orgId,
                                                                  @Parameter(hidden = true)
                                                                  @AuthenticationPrincipal
                                                                  OAuth2AuthenticatedPrincipal principal,
                                                                  Pageable pageable) {

        final Long userOrgId = PrincipalMapper.getUserOrgId(principal);
        Predicate predicate = nonNull(userOrgId)
                ? QActivityWorkInProgress.activityWorkInProgress.activityType.eq(ActivityType.DAN)
                .and(QActivityWorkInProgress.activityWorkInProgress.organisation.id.eq(userOrgId))
                : QActivityWorkInProgress.activityWorkInProgress.activityType.eq(ActivityType.DAN)
                .and(QActivityWorkInProgress.activityWorkInProgress.organisation.id.eq(wpgwnProperties.getDanId()))
                .and(QActivityWorkInProgress.activityWorkInProgress.createdBy.eq(principal.getName()));

        return activityWorkInProgressService.findByPredicate(predicate, pageable)
                .map(workInProgressMapper::activityWorkInProgressToActivityDto);

    }

    /**
     * Erstellen einer neuen Dan (WIP).
     *
     * @param principal
     * @return
     */
    @PostMapping
    public ActivityWorkInProgressResponseDto createDanWorkInProgress(@PathVariable("orgId") Long orgId,
                                                                     @Parameter(hidden = true) @AuthenticationPrincipal
                                                                     OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getDanOrganisation(principal);
        danValidator.checkDanPermission(principal, organisation);

        final ActivityWorkInProgress danWorkInProgress =
                workInProgressMapper.activityDtoToActivityWip(organisation);

        danWorkInProgress.setOrganisation(organisation);
        danWorkInProgress.setActivityType(ActivityType.DAN);
        danWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        danWorkInProgress.setRandomIdGenerationTime(Instant.now(clock));

        final ActivityWorkInProgress savedDanWip = activityWorkInProgressService.save(danWorkInProgress);
        return workInProgressMapper.activityWorkInProgressToActivityDto(savedDanWip);
    }


    /**
     * Aktualisieren von Dan (WIP).
     *
     * @param principal
     * @return
     */
    @PutMapping("/{randomUniqueId}")
    public ActivityWorkInProgressResponseDto updateDanWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @PathVariable("randomUniqueId") UUID randomUuid,
            @Valid @RequestBody
            ActivityWorkInProgressRequestDto activityWorkInProgressDto,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getDanOrganisation(principal);
        danValidator.checkDanPermission(principal, organisation);

        final ActivityWorkInProgress savedDanWorkInProgress =
                findDanWorkInProgressAndCheckPermission(randomUuid, principal);

        workInProgressMapper.updateActivityFromWorkInProgressActivityDto(activityWorkInProgressDto,
                savedDanWorkInProgress);

        savedDanWorkInProgress.setActivityType(ActivityType.DAN);

        final ActivityWorkInProgress
                updatedActivityWorkInProgress = activityWorkInProgressService.save(savedDanWorkInProgress);

        return workInProgressMapper.activityWorkInProgressToActivityDto(updatedActivityWorkInProgress);
    }

    /**
     * Laden Dan (WIP) bei UUID.
     *
     * @param principal
     * @return
     */
    @GetMapping("/{randomUniqueId}")
    public ActivityWorkInProgressResponseDto getDanWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @PathVariable("randomUniqueId") UUID randomUuid,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final ActivityWorkInProgress savedDanWorkInProgress =
                findDanWorkInProgressAndCheckPermission(randomUuid, principal);

        return workInProgressMapper.activityWorkInProgressToActivityDto(savedDanWorkInProgress);
    }

    /**
     * Delete Dan (WIP) bei UUID.
     *
     * @param principal
     * @return
     */
    @DeleteMapping("/{randomUniqueId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDanWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @PathVariable("randomUniqueId") UUID randomUuid,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {

        final ActivityWorkInProgress savedDanWorkInProgress =
                findDanWorkInProgressAndCheckPermission(randomUuid, principal);

        activityWorkInProgressService.delete(savedDanWorkInProgress);
    }

    /**
     * veröffentlichen Dan (WIP).
     *
     * @param principal
     * @return
     */
    @PostMapping("/{randomUniqueId}/releases")
    public ActivityResponseDto publishDanWorkInProgress(
            @PathVariable("orgId") Long orgId,
            @PathVariable("randomUniqueId") UUID randomUuid,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {

        final ActivityWorkInProgress savedDanWorkInProgress =
                findDanWorkInProgressAndCheckPermission(randomUuid, principal);
        danValidator.validateMaxItemNumber(savedDanWorkInProgress, principal);
        final Activity savedDan = activityWorkInProgressPublishService
                .updateActivityWithActivityWorkInProgress(savedDanWorkInProgress, principal);
        savedDanWorkInProgress.setActivity(savedDan);
        activityWorkInProgressService.delete(savedDanWorkInProgress);
        return activityMapper.activityToDto(savedDan);
    }

    private ActivityWorkInProgress findDanWorkInProgressAndCheckPermission(UUID randomUuid,
                                                                           OAuth2AuthenticatedPrincipal principal) {
        danRangeService.isDanAvailable();
        final ActivityWorkInProgress savedDanWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(randomUuid);

        danValidator.checkReadOrWriteDanPermission(principal, savedDanWorkInProgress.getOrganisation(),
                savedDanWorkInProgress.getCreatedBy());
        return savedDanWorkInProgress;
    }

}

