package com.exxeta.wpgwn.wpgwnapp.activity_subscription;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityService;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.dto.ActivitySubscriptionRequestDto;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.dto.ActivitySubscriptionResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.model.ActivitySubscription;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/v1/activity-subscription")
@RequiredArgsConstructor
public class ActivitySubscriptionController {

    private final ActivityService activityService;
    private final ActivitySubscriptionService activitySubscriptionService;
    private final ActivitySubscriptionRepository activitySubscriptionRepository;
    private final ActivitySubscriptionMapper activitySubscriptionMapper;

    @GetMapping
    @RolesAllowed(PermissionPool.GUEST)
    public Page<ActivitySubscriptionResponseDto> getPagedActivitySubscriptionsForCurrentUser(
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return activitySubscriptionRepository
                .findAllBySubscribedUserId(principal.getName(), pageable)
                .map(activitySubscriptionMapper::activitySubscriptionToDto);
    }

    @PostMapping
    @RolesAllowed(PermissionPool.GUEST)
    public ActivitySubscriptionResponseDto createActivitySubscriptionForCurrentUser(
            @RequestBody ActivitySubscriptionRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        Activity activity = activityService.getActivityById(requestDto.getActivityId());

        if (activitySubscriptionRepository.findBySubscribedUserIdAndActivity(principal.getName(), activity)
                .isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format(
                            "Can't create [%s] for [User] with id [%s] and [%s] with id [%s]: [User] has already subscribed this [%s]!",
                            "ActivitySubscription", principal.getName(), "Activity", requestDto.getActivityId(),
                            "Activity"));
        }

        return activitySubscriptionMapper.activitySubscriptionToDto(activitySubscriptionService
                .createActivitySubscriptionForActivityAndUser(activity, principal.getName()));
    }

    @DeleteMapping
    @RolesAllowed(PermissionPool.GUEST)
    public void deleteActivitySubscriptionForCurrentUserByActId(
            @RequestBody ActivitySubscriptionRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        Activity activity = activityService.getActivityById(requestDto.getActivityId());

        ActivitySubscription activitySubscription =
                activitySubscriptionRepository.findBySubscribedUserIdAndActivity(principal.getName(), activity)
                        .orElseThrow(() -> new EntityNotFoundException(
                                String.format("Can't find [%s] for [User] with id [%s] and [%s] with id [%s]!",
                                        "ActivitySubscription", principal.getName(), "Activity",
                                        requestDto.getActivityId())));

        activitySubscriptionRepository.delete(activitySubscription);
    }

    @DeleteMapping("/{actSubId}")
    @RolesAllowed(PermissionPool.GUEST)
    public void deleteActivitySubscriptionForCurrentUser(
            @PathVariable("actSubId") Long actSubId,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        ActivitySubscription activitySubscription = activitySubscriptionRepository.findById(actSubId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "ActivitySubscription",
                                actSubId)));

        if (!activitySubscription.getSubscribedUserId().equals(principal.getName())) {
            throw new AccessDeniedException(String.format("User [%s] has no permission for entity [%s] with id [%s].",
                    principal.getName(), "ActivitySubscription", actSubId));
        }

        activitySubscriptionRepository.delete(activitySubscription);
    }
}
