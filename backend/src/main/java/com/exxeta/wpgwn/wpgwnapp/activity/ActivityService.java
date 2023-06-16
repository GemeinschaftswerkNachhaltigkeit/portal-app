package com.exxeta.wpgwn.wpgwnapp.activity;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

import com.querydsl.core.types.Predicate;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityWorkInProgressService activityWorkInProgressService;
    private final FileStorageService fileStorageService;

    public Activity save(@NonNull Activity activity) {
        return activityRepository.save(activity);
    }

    public Activity getActivityById(long activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Activity", activityId)));
    }

    @Transactional
    public void deleteActivitiesForOrganisation(Organisation organisation) {
        List<Activity> activities = activityRepository.findAllByOrganisation(organisation);
        activities.forEach(this::deleteActivity);
    }

    @Transactional
    public void deleteActivity(Activity activity) {
        activityWorkInProgressService.deleteByActivity(activity);

        try {
            fileStorageService.deleteFileIfPresent(activity.getLogo());
            fileStorageService.deleteFileIfPresent(activity.getImage());
            if (Objects.nonNull(activity.getContact())) {
                fileStorageService.deleteFileIfPresent(activity.getContact().getImage());
            }
        } catch (IOException e) {
            log.warn("Unexpected error while deleting images for activity [{}]", activity.getId(), e);
        }

        activityRepository.delete(activity);
    }

    public Page<Activity> findAllByOrganisationIdIs(Long orgId, Pageable pageable) {
        return activityRepository.findAllByOrganisationIdIs(orgId, pageable);
    }

    public Page<Activity> findByPredicate(Predicate predicate, Pageable pageable) {
        return activityRepository.findAll(predicate, pageable);
    }

    public Optional<Activity> findById(Long actId) {
        return activityRepository.findById(actId);
    }

    public List<Activity> findActivitiesBetween(Instant start, Instant end) {
        return activityRepository.findByPeriodStartBetween(start, end);
    }

    public Map<Instant, Integer> getActivityStatistic(Instant start, Instant end) {
        List<Activity> activities = findActivitiesBetween(start, end);
        Map<Instant, Integer> result = new HashMap<>();
        for (Activity activity : activities) {
            Instant from = activity.getPeriod().getStart();
            result.put(from, result.getOrDefault(from, 0) + 1);
        }
        return result;
    }
}
