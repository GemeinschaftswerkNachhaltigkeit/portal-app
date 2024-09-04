package com.exxeta.wpgwn.wpgwnapp.activity;

import java.util.Objects;

import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityDetailsResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity.model.QActivity;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
@Slf4j
public class ActivitiesController {

    private final ActivityRepository activityRepository;

    private final ActivityMapper mapper;

    private final GeometryFactory factory;

    private final ActivityService activityService;

    @GetMapping
    Page<ActivityResponseDto> findActivitiesPage(@RequestParam(value = "envelope", required = false) Envelope envelope,
                                                 @RequestParam(value = "query", required = false) String query,
                                                 @QuerydslPredicate(root = Activity.class, bindings = ActivityBindingCustomizer.class)
                                                 Predicate filterPredicate,
                                                 Pageable pageable) {
        final BooleanBuilder searchPredicate = new BooleanBuilder(filterPredicate);
        searchPredicate.and(QActivity.activity.status.eq(ItemStatus.ACTIVE));
        if (Objects.nonNull(envelope)) {
            searchPredicate.and(QActivity.activity.location.coordinate
                    .within(factory.toGeometry(envelope)));
        }

        if (StringUtils.hasText(query)) {
            BooleanExpression searchFieldsForQuery = QActivity.activity.name.containsIgnoreCase(query)
                    .or(QActivity.activity.description.containsIgnoreCase(query));
            searchPredicate.and(searchFieldsForQuery);
        }

        final Page<Activity> activitiesPage = activityRepository.findAll(searchPredicate, pageable);
        return activitiesPage.map(mapper::activityToDto);
    }

    @GetMapping("/{id}")
    ActivityDetailsResponseDto findActivityById(@PathVariable("id") Long id) {
        return activityRepository.findById(id)
                .map(mapper::activityToDetailsDto)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Activity", id)));
    }

}

