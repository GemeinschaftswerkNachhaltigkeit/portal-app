package com.exxeta.wpgwn.wpgwnapp.activity;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ItemStatusChangeDto;
import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityDeleteEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity.model.QActivity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

import com.querydsl.core.types.Predicate;
import io.swagger.v3.oas.annotations.Parameter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;
import java.util.Objects;
import java.util.UUID;

/**
 * Controller für Aktivitäten einer Organisation.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/activities")
@RequiredArgsConstructor
@Slf4j
public class OrganisationActivitiesController {

    private final ActivityService activityService;

    private final ActivityMapper activityMapper;

    private final OrganisationValidator organisationValidator;

    private final ActivityWorkInProgressService activityWorkInProgressService;

    private final ContactInviteService contactInviteService;

    private final ActivityWorkInProgressMapper workInProgressMapper;

    private final ApplicationEventPublisher applicationEventPublisher;

    @GetMapping
    Page<ActivityResponseDto> findActivitiesForOrganisation(@PathVariable("orgId") Long orgId, Pageable pageable) {
        Predicate predicate = QActivity.activity.organisation.id.eq(orgId)
                .and(QActivity.activity.status.eq(ItemStatus.ACTIVE))
                .and(QActivity.activity.activityType.ne(ActivityType.DAN).or(QActivity.activity.activityType.isNull()));
        return activityService.findByPredicate(predicate, pageable)
                .map(activityMapper::activityToDto);
    }

    /**
     * Endpunkt zum Aktualisieren von Aktivitäten.
     * Aus der vorhandenen Aktivität wird eine {@link ActivityWorkInProgress} erstellt, die bearbeitet wird.
     * Am Ende der Bearbeitung wird der Endpunkt
     * {@link com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressController#publishWorkInProgress(UUID, Long, OAuth2AuthenticatedPrincipal)}}
     * aufgerufen, um die Änderungen auf die Aktivität zu übertragen.
     *
     * @param orgId
     * @param actId
     * @param principal
     * @return
     */
    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @PutMapping("/{actId}")
    ActivityWorkInProgressResponseDto updateActivity(@PathVariable("orgId") Long orgId,
                                                     @PathVariable("actId") Long actId,
                                                     @Parameter(hidden = true) @AuthenticationPrincipal
                                                     OAuth2AuthenticatedPrincipal principal) {

        final Activity activity = findActivityAndCheckPermission(actId, principal);

        final ActivityWorkInProgress activityWorkInProgress =
                activityMapper.mapActivityToWorkInProgress(activity);

        final ActivityWorkInProgress savedActivityWorkInProgress =
                activityWorkInProgressService.save(activityWorkInProgress);
        return workInProgressMapper.activityWorkInProgressToActivityDto(savedActivityWorkInProgress);
    }

    /**
     * Endpunkt zum Aktualisieren von Aktivitäten.
     * Aus der vorhandenen Aktivität wird eine {@link ActivityWorkInProgress} erstellt, die bearbeitet wird.
     * Am Ende der Bearbeitung wird der Endpunkt
     * {@link com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressController#publishWorkInProgress(UUID, Long, OAuth2AuthenticatedPrincipal)}
     * aufgerufen, um die Änderungen auf die Aktivität zu übertragen.
     *
     * @param orgId
     * @param actId
     * @param principal
     * @return
     */
    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @PutMapping("/{actId}/status")
    ActivityResponseDto setActivityStatus(@PathVariable("orgId") Long orgId,
                                          @PathVariable("actId") Long actId,
                                          @RequestBody ItemStatusChangeDto itemStatusChangeDto,
                                          @Parameter(hidden = true) @AuthenticationPrincipal
                                          OAuth2AuthenticatedPrincipal principal) {

        final Activity activity = findActivityAndCheckPermission(actId, principal);

        final Activity savedActivity;
        if (!Objects.equals(activity.getStatus(), itemStatusChangeDto.getStatus())) {
            activity.setStatus(itemStatusChangeDto.getStatus());
            savedActivity = activityService.save(activity);
        } else {
            savedActivity = activity;
        }

        return activityMapper.activityToDto(savedActivity);
    }

    @RolesAllowed(PermissionPool.ACTIVITY_CHANGE)
    @DeleteMapping("/{actId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void deleteActivity(@PathVariable("orgId") Long orgId,
                        @PathVariable("actId") Long actId,
                        @Parameter(hidden = true) @AuthenticationPrincipal
                        OAuth2AuthenticatedPrincipal principal) {
        final Activity activity = findActivityAndCheckPermission(actId, principal);

        activityWorkInProgressService.deleteByActivity(activity);
        contactInviteService.handleDeleteActivity(activity);

        activityService.deleteActivity(activity);

        applicationEventPublisher.publishEvent(new ActivityDeleteEvent(orgId, actId));
    }


    private Activity findActivityAndCheckPermission(Long actId, OAuth2AuthenticatedPrincipal principal) {
        final Activity activity = activityService.findById(actId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "ActivityInvite", actId)));
        final Organisation organisation = Objects.requireNonNull(activity.getOrganisation());
        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        return activity;
    }

}

