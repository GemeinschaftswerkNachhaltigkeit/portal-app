package com.exxeta.wpgwn.wpgwnapp.activity;

import jakarta.persistence.EntityNotFoundException;
import java.util.Objects;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ItemStatusChangeDto;
import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityDeleteEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity.model.QActivity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressMapper;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.utils.PrincipalMapper;

import com.querydsl.core.types.Predicate;
import io.swagger.v3.oas.annotations.Parameter;

import static java.util.Objects.nonNull;

/**
 * Controller für Dan Verwaltung.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/dans")
@RequiredArgsConstructor
@Slf4j
public class DansController {

    private final ActivityService activityService;

    private final ActivityMapper activityMapper;

    private final DanValidator danValidator;

    private final ActivityWorkInProgressService activityWorkInProgressService;

    private final ContactInviteService contactInviteService;

    private final ActivityWorkInProgressMapper workInProgressMapper;

    private final ApplicationEventPublisher applicationEventPublisher;

    private final WpgwnProperties wpgwnProperties;


    private final DanRangeService danRangeService;

    @GetMapping
    Page<ActivityResponseDto> findDanForOrganisation(@PathVariable("orgId") Long orgId,
                                                     @Parameter(hidden = true) @AuthenticationPrincipal
                                                     OAuth2AuthenticatedPrincipal principal,
                                                     Pageable pageable) {
        final Long userOrgId = PrincipalMapper.getUserOrgId(principal);
        Predicate predicate = nonNull(userOrgId)
                ? QActivity.activity.activityType.eq(ActivityType.DAN)
                .and(QActivity.activity.organisation.id.eq(userOrgId))
                : QActivity.activity.activityType.eq(ActivityType.DAN)
                .and(QActivity.activity.organisation.id.eq(wpgwnProperties.getDanId()))
                .and(QActivity.activity.createdBy.eq(principal.getName()));
        return activityService.findByPredicate(predicate, pageable)
                .map(activityMapper::activityToDto);
    }

    /**
     * Endpunkt zum Aktualisieren von Dan.
     * Aus der vorhandenen Dan wird eine {@link ActivityWorkInProgress} erstellt, die bearbeitet wird.
     * Am Ende der Bearbeitung wird der Endpunkt
     * {@link com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.DanWorkInProgressController#publishDanWorkInProgress(Long, UUID, OAuth2AuthenticatedPrincipal)}}
     * aufgerufen, um die Änderungen auf die Dan zu übertragen.
     *
     * @param actId
     * @param principal
     * @return
     */
    @PutMapping("/{actId}")
    ActivityWorkInProgressResponseDto updateDan(@PathVariable("orgId") Long orgId,
                                                @PathVariable("actId") Long actId,
                                                @Parameter(hidden = true) @AuthenticationPrincipal
                                                OAuth2AuthenticatedPrincipal principal) {
        final Activity activity = findDanAndCheckPermission(actId, principal);

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
     * @param actId
     * @param principal
     * @return
     */
    @PutMapping("/{actId}/status")
    ActivityResponseDto setDanStatus(@PathVariable("orgId") Long orgId,
                                     @PathVariable("actId") Long actId,
                                     @RequestBody ItemStatusChangeDto itemStatusChangeDto,
                                     @Parameter(hidden = true) @AuthenticationPrincipal
                                     OAuth2AuthenticatedPrincipal principal) {

        final Activity activity = findDanAndCheckPermission(actId, principal);

        final Activity savedActivity;

        if (!Objects.equals(activity.getStatus(), itemStatusChangeDto.getStatus())) {
            activity.setStatus(itemStatusChangeDto.getStatus());
            savedActivity = activityService.save(activity);
        } else {
            savedActivity = activity;
        }

        return activityMapper.activityToDto(savedActivity);
    }


    @DeleteMapping("/{actId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void deleteDan(@PathVariable("orgId") Long orgId,
                   @PathVariable("actId") Long actId,
                   @Parameter(hidden = true) @AuthenticationPrincipal
                   OAuth2AuthenticatedPrincipal principal) {
        final Activity activity = findDanAndCheckPermission(actId, principal);

        activityWorkInProgressService.deleteByActivity(activity);

        contactInviteService.handleDeleteActivity(activity);

        activityService.deleteActivity(activity);

        applicationEventPublisher.publishEvent(new ActivityDeleteEvent(activity.getOrganisation().getId(), actId));
    }


    private Activity findDanAndCheckPermission(Long actId, OAuth2AuthenticatedPrincipal principal) {
        danRangeService.isDanAvailable();
        final Activity activity = activityService.findById(actId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "ActivityInvite", actId)));
        final Organisation organisation = Objects.requireNonNull(activity.getOrganisation());
        danValidator.checkReadOrWriteDanPermission(principal, organisation, activity.getCreatedBy());

        return activity;
    }

}

