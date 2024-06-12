package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

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
import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.activity.DanValidator;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.DanSetting;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.files.FileUploadDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SpecialTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Period;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SpecialType;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;

import static com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.QActivityWorkInProgress.activityWorkInProgress;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.DAN;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.EVENT;


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

    private final DanValidator danValidator;

    private final DanRangeService danRangeService;

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
    @GetMapping()
    Page<ActivityWorkInProgressResponseDto> getActivitiesWorkInProgress(@PathVariable("orgId") Long orgId,
                                                                        @RequestParam(value = "includeDan", defaultValue = "false")
                                                                        Boolean includeDan,
                                                                        @Parameter(hidden = true)
                                                                        @AuthenticationPrincipal
                                                                        OAuth2AuthenticatedPrincipal principal,
                                                                        Pageable pageable) {

        final Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        Predicate predicate = buildPredicate(orgId, includeDan, principal);

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
    @PostMapping("/{type}")
    public ActivityWorkInProgressResponseDto createActivity(@PathVariable("orgId") Long orgId,
                                                            @PathVariable("type") SpecialTypeDto type,
                                                            @Parameter(hidden = true) @AuthenticationPrincipal
                                                            OAuth2AuthenticatedPrincipal principal) {

        final Organisation organisation = validateOrganisation(principal, orgId);

        ActivityWorkInProgress activityWorkInProgress = createActivityWip(organisation, type);

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

        validateOrganisation(principal, orgId);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.findByRandomUniqueId(activityWipId);
        ActivityType orginalActivityType = savedActivityWorkInProgress.getActivityType();
        workInProgressMapper.updateActivityFromWorkInProgressActivityDto(activityWorkInProgressDto,
                savedActivityWorkInProgress);

        savedActivityWorkInProgress.setActivityType(orginalActivityType);

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

        updateTypeActivityWorkInProgress(workInProgress);

        danValidator.validateMaxItemNumber(workInProgress, principal);

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

    private Organisation validateOrganisation(OAuth2AuthenticatedPrincipal principal, Long orgId) {
        Organisation organisation = organisationService.getOrganisation(orgId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        return organisation;
    }

    private ActivityWorkInProgress createActivityWip(Organisation organisation, SpecialTypeDto type) {
        ActivityWorkInProgress activityWip = workInProgressMapper.activityDtoToActivityWip(organisation);

        if (SpecialTypeDto.DAN == type) {
            danRangeService.isDanAvailable();
            DanSetting danSetting = danRangeService.getDanSetting();
            activityWip.setPeriod(new Period(danSetting.startMin(), danSetting.endMax()));
            activityWip.setActivityType(ActivityType.DAN);
        } else {
            activityWip.setActivityType(EVENT);
        }

        activityWip.setOrganisation(organisation);
        activityWip.setRandomUniqueId(UUID.randomUUID());
        activityWip.setRandomIdGenerationTime(Instant.now(clock));
        return activityWip;
    }


    private Predicate buildPredicate(Long orgId, Boolean includeDan, OAuth2AuthenticatedPrincipal principal) {
        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and(activityWorkInProgress.organisation.id.eq(orgId));

        if (!includeDan) {
            predicate.and(activityWorkInProgress.activityType.ne(DAN)
                    .or(activityWorkInProgress.activityType.isNull()));
        }

        predicate.and(activityWorkInProgress.importProcess.isNotNull()
                .or(activityWorkInProgress.createdBy.eq(principal.getName())));

        return predicate;
    }


    private void updateTypeActivityWorkInProgress(ActivityWorkInProgress workInProgress) {
        SpecialType specialType = workInProgress.getSpecialType();
        ActivityType activityType = workInProgress.getActivityType();

        if (SpecialType.DAN.equals(specialType) || ActivityType.DAN.equals(activityType)) {
            workInProgress.setActivityType(ActivityType.DAN);
        } else {
            workInProgress.setActivityType(ActivityType.EVENT);
        }
    }

}
