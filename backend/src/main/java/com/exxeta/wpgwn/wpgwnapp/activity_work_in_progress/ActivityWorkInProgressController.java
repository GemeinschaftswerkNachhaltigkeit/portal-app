package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.files.FileUploadDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import com.querydsl.core.types.Predicate;
import io.swagger.v3.oas.annotations.Parameter;

import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.DAN;


/**
 * Controller mit Endpunkten zum Verwalten von Aktivitäts-Arbeitsständen.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/activities-wip")
@RequiredArgsConstructor
@Transactional
public class ActivityWorkInProgressController {

    private final ActivityWorkInProgressMapper workInProgressMapper;

    private final ActivityMapper activityMapper;

    private final OrganisationService organisationService;

    private final ActivityWorkInProgressService activityWorkInProgressService;

    private final ActivityWorkInProgressPublishService activityWorkInProgressPublishService;

    private final OrganisationValidator organisationValidator;

    private final Clock clock;

    /**
     * Abrufen aller unvollständigen Aktivitäten (WIP) (Seitenweise) die imporiert wurden oder bei denen der eingeloggte
     * User der creator ist.
     *
     * @param orgId
     * @param principal
     * @return
     */
    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @GetMapping
    Page<ActivityWorkInProgressResponseDto> getActivitiesWorkInProgress(@PathVariable("orgId") Long orgId,
                                                                        @Parameter(hidden = true)
                                                                        @AuthenticationPrincipal
                                                                        OAuth2AuthenticatedPrincipal principal,
                                                                        Pageable pageable) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final Predicate predicate = QActivityWorkInProgress.activityWorkInProgress.organisation.id.eq(orgId)
                .and(QActivityWorkInProgress.activityWorkInProgress.activityType.ne(DAN)
                        .or(QActivityWorkInProgress.activityWorkInProgress.activityType.isNull()))
                .and(QActivityWorkInProgress.activityWorkInProgress.importProcess.isNotNull()
                        .or(QActivityWorkInProgress.activityWorkInProgress.createdBy.eq(principal.getName())));
        return activityWorkInProgressService.findByPredicate(predicate, pageable)
                .map(workInProgressMapper::activityWorkInProgressToActivityDto);
    }

    /**
     * Erstellen einer neuen Aktivität.
     *
     * @param orgId
     * @param principal
     * @return
     */
    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @PostMapping
    public ActivityWorkInProgressResponseDto createActivity(@PathVariable("orgId") Long orgId,
                                                            @Parameter(hidden = true) @AuthenticationPrincipal
                                                            OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final ActivityWorkInProgress activityWorkInProgress =
                workInProgressMapper.activityDtoToActivityWip(organisation);

        activityWorkInProgress.setOrganisation(organisation);
        activityWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        activityWorkInProgress.setRandomIdGenerationTime(Instant.now(clock));

        final ActivityWorkInProgress savedActivityWip = activityWorkInProgressService.save(activityWorkInProgress);
        return workInProgressMapper.activityWorkInProgressToActivityDto(savedActivityWip);
    }

    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @PutMapping("/{randomUniqueId}")
    public ActivityWorkInProgressResponseDto updateActivityWorkInProgress(
            @PathVariable("randomUniqueId") UUID activityWipId,
            @PathVariable("orgId") Long orgId,
            @Valid @RequestBody
            ActivityWorkInProgressRequestDto activityWorkInProgressDto,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);

        workInProgressMapper.updateActivityFromWorkInProgressActivityDto(activityWorkInProgressDto,
                savedActivityWorkInProgress);
        final ActivityWorkInProgress
                updatedActivityWorkInProgress = activityWorkInProgressService.save(savedActivityWorkInProgress);
        return workInProgressMapper.activityWorkInProgressToActivityDto(updatedActivityWorkInProgress);
    }


    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @GetMapping("/{randomUniqueId}")
    public ActivityWorkInProgressResponseDto getActivityWorkInProgress(
            @PathVariable("randomUniqueId") UUID randomUuid,
            @PathVariable("orgId") Long orgId,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(randomUuid);

        return workInProgressMapper.activityWorkInProgressToActivityDto(savedActivityWorkInProgress);
    }

    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @DeleteMapping("/{randomUniqueId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivityWorkInProgress(@PathVariable("randomUniqueId") UUID activityWipId,
                                             @PathVariable("orgId") Long orgId,
                                             @Parameter(hidden = true) @AuthenticationPrincipal
                                             OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        final Optional<ActivityWorkInProgress> savedActivityWorkInProgress =
                activityWorkInProgressService.maybeFindByRandomUniqueId(activityWipId);
        savedActivityWorkInProgress.ifPresent(activityWorkInProgressService::delete);
    }

    /**
     * Endpunkt zum Veröffentlichen von Aktivitätsänderungen die im Arbeitsstadium sind.
     */
    @RolesAllowed(PermissionPool.ACTIVITY_PUBLISH)
    @PostMapping("/{randomUniqueId}/releases")
    public ActivityResponseDto publishWorkInProgress(@PathVariable("randomUniqueId") UUID activityRandomUniqueId,
                                                     @PathVariable("orgId") Long orgId,
                                                     @Parameter(hidden = true) @AuthenticationPrincipal
                                                     OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final ActivityWorkInProgress workInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityRandomUniqueId);
        final Activity savedActivity = activityWorkInProgressPublishService
                .updateActivityWithActivityWorkInProgress(workInProgress, principal);
        workInProgress.setActivity(savedActivity);

        activityWorkInProgressService.delete(workInProgress);
        return activityMapper.activityToDto(savedActivity);
    }


    @PutMapping("/{randomUniqueId}/logo")
    public FileUploadDto updateActivityLogo(@PathVariable("randomUniqueId") UUID activityWipId,
                                            @PathVariable("orgId") Long orgId,
                                            @RequestParam("file") MultipartFile file,
                                            @Parameter(hidden = true) @AuthenticationPrincipal
                                            OAuth2AuthenticatedPrincipal principal)
            throws IOException {

        final ActivityWorkInProgress activityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.saveActivityLogo(activityWorkInProgress, file);
        return new FileUploadDto(savedActivityWorkInProgress.getLogo());
    }


    @DeleteMapping("/{randomUniqueId}/logo")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivityLogo(@PathVariable("randomUniqueId") UUID activityWipId,
                                   @PathVariable("orgId") Long orgId,
                                   @Parameter(hidden = true) @AuthenticationPrincipal
                                   OAuth2AuthenticatedPrincipal principal)
            throws IOException {

        final ActivityWorkInProgress activityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);


        activityWorkInProgressService.deleteActivityLogo(activityWorkInProgress);
    }

    @PutMapping("/{randomUniqueId}/image")
    public FileUploadDto updateActivityImage(@PathVariable("randomUniqueId") UUID activityWipId,
                                             @PathVariable("orgId") Long orgId,
                                             @RequestParam("file") MultipartFile file,
                                             @Parameter(hidden = true) @AuthenticationPrincipal
                                             OAuth2AuthenticatedPrincipal principal)
            throws IOException {

        final ActivityWorkInProgress activityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.saveActivityImage(activityWorkInProgress, file);
        return new FileUploadDto(savedActivityWorkInProgress.getImage());
    }


    @DeleteMapping("/{randomUniqueId}/image")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivityImage(@PathVariable("randomUniqueId") UUID activityWipId,
                                    @PathVariable("orgId") Long orgId,
                                    @Parameter(hidden = true) @AuthenticationPrincipal
                                    OAuth2AuthenticatedPrincipal principal)
            throws IOException {

        final ActivityWorkInProgress activityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);

        activityWorkInProgressService.deleteActivityImage(activityWorkInProgress);
    }

    @PutMapping("/{randomUniqueId}/contact/image")
    public FileUploadDto updateActivityContactImage(@PathVariable("randomUniqueId") UUID activityWipId,
                                                    @PathVariable("orgId") Long orgId,
                                                    @RequestParam("file") MultipartFile file,
                                                    @Parameter(hidden = true) @AuthenticationPrincipal
                                                    OAuth2AuthenticatedPrincipal principal)
            throws IOException {

        final ActivityWorkInProgress activityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.saveActivityContactImage(activityWorkInProgress, file);
        return new FileUploadDto(savedActivityWorkInProgress.getContactWorkInProgress().getImage());
    }

    @DeleteMapping("/{randomUniqueId}/contact/image")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivityContactImage(@PathVariable("randomUniqueId") UUID activityWipId,
                                           @PathVariable("orgId") Long orgId,
                                           @Parameter(hidden = true) @AuthenticationPrincipal
                                           OAuth2AuthenticatedPrincipal principal)
            throws IOException {

        final ActivityWorkInProgress activityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);
        activityWorkInProgressService.deleteActivityContactImage(activityWorkInProgress);
    }

}
