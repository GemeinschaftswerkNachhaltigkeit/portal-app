package com.exxeta.wpgwn.wpgwnapp.map_search;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.DanSetting;
import com.exxeta.wpgwn.wpgwnapp.hibernate.FullTextSearchHelper;
import com.exxeta.wpgwn.wpgwnapp.map_search.dto.MapSearchMarkerResponseDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.dto.MapSearchResultWrapperDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapMarkerView;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapSearchV2Result;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.QMapSearchV2Result;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;

import com.google.common.base.CharMatcher;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import static com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication.DEFAULT_ZONE_ID;
import static com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper.PERMANENT_END;
import static com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper.PERMANENT_START;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.DAN;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.EVENT;
import static org.springframework.util.StringUtils.hasText;

@RestController
@RequestMapping("/api/v2/search")
@RequiredArgsConstructor
@Slf4j
public class MapSearchV2Controller {

    private final GeometryFactory factory;
    private final MapSearchV2ResultMapper mapper;
    @PersistenceContext
    private final EntityManager entityManager;

    private final FullTextSearchHelper fullTextSearchHelper;

    private final DanRangeService danRangeService;
    private final Clock clock;

    @SuppressWarnings("ParameterNumber")
    @GetMapping
    @Transactional(readOnly = true)
    public Page<MapSearchResultWrapperDto> searchMap(
            @RequestParam(value = "envelope", required = false) Envelope envelope,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "organisationType", required = false) List<OrganisationType> organisationTypes,
            @RequestParam(value = "activityTypes", required = false) List<ActivityType> activityTypes,
            @RequestParam(value = "includeExpiredActivities", defaultValue = "false") Boolean includeExpiredActivities,
            @RequestParam(value = "includeAllActionDays", defaultValue = "false") Boolean includeAllActionDays,
            @RequestParam(value = "expiredOnEnd", defaultValue = "true") Boolean expiredOnEnd,
            @RequestParam(value = "includeNoCoords", defaultValue = "true") Boolean includeNoCoords,
            @RequestParam(value = "initiator", required = false) Boolean initiator,
            @RequestParam(value = "permanent", required = false) Boolean permanent,
            @RequestParam(value = "online", required = false) Boolean online,
            @RequestParam(value = "projectSustainabilityWinner", required = false) Boolean projectSustainabilityWinner,
            @QuerydslPredicate(root = MapSearchV2Result.class, bindings = MapSearchV2ResultBindingCustomizer.class)
            Predicate mapSearchFilterPredicate, Pageable pageable) {
        final BooleanBuilder searchPredicate =
                getSearchPredicate(envelope, query, location, organisationTypes, activityTypes,
                        includeExpiredActivities, includeNoCoords, initiator, permanent, online,
                        projectSustainabilityWinner, includeAllActionDays, mapSearchFilterPredicate);

        JPAQuery<MapSearchV2Result> jpaQuery =
                new JPAQuery<MapSearchV2Result>(entityManager).from(QMapSearchV2Result.mapSearchV2Result)
                        .where(searchPredicate);

        if (expiredOnEnd) {
            jpaQuery.orderBy(expiredExpression().asc());
        }

        if (pageable.getSort().isSorted()) {
            jpaQuery.orderBy(getOrderSpecifiers(pageable, MapSearchV2Result.class));
        } else {
            if (hasText(query)) {
                jpaQuery.orderBy(tsRankExpression(query).desc());
            }
            jpaQuery.orderBy(QMapSearchV2Result.mapSearchV2Result.modifiedAt.desc())
                    .orderBy(QMapSearchV2Result.mapSearchV2Result.createdAt.desc());
        }

        jpaQuery.offset(pageable.getOffset()).limit(pageable.getPageSize());

        final Page<MapSearchV2Result> activitiesPage =
                PageableExecutionUtils.getPage(jpaQuery.fetch(), pageable, jpaQuery::fetchCount);

        return activitiesPage.map(mapper::mapSearchResultToDto);
    }

    @SuppressWarnings("ParameterNumber")
    @GetMapping("/month/{monthStart}")
    @Transactional(readOnly = true)
    public Map<Instant, Integer> activityStatisticCalendar(@PathVariable("monthStart") Instant monthStart,
                                                           @RequestParam(value = "envelope", required = false)
                                                           Envelope envelope,
                                                           @RequestParam(value = "query", required = false)
                                                           String query,
                                                           @RequestParam(value = "location", required = false)
                                                           String location,
                                                           @RequestParam(value = "organisationType", required = false)
                                                           List<OrganisationType> organisationTypes,
                                                           @RequestParam(value = "activityTypes", required = false)
                                                           List<ActivityType> activityTypes,
                                                           @RequestParam(value = "includeExpiredActivities", defaultValue = "true")
                                                           Boolean includeExpiredActivities,
                                                           @RequestParam(value = "includeAllActionDays", defaultValue = "true")
                                                           Boolean includeAllActionDays,
                                                           @RequestParam(value = "includeNoCoords", defaultValue = "true")
                                                           Boolean includeNoCoords,
                                                           @RequestParam(value = "initiator", required = false)
                                                           Boolean initiator,
                                                           @RequestParam(value = "permanent", required = false)
                                                           Boolean permanent,
                                                           @RequestParam(value = "online", required = false)
                                                           Boolean online,
                                                           @RequestParam(value = "projectSustainabilityWinner", required = false)
                                                           Boolean projectSustainabilityWinner,
                                                           @QuerydslPredicate(root = MapSearchV2Result.class, bindings = MapSearchV2ResultBindingCustomizer.class)
                                                           Predicate mapSearchFilterPredicate) {

        final BooleanBuilder searchPredicate =
                getSearchPredicate(envelope, query, location, organisationTypes, activityTypes,
                        includeExpiredActivities, includeNoCoords, initiator, permanent, online,
                        projectSustainabilityWinner, includeAllActionDays, mapSearchFilterPredicate);

        Instant[] range = initMonthRange(monthStart);

        searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.period.start.goe(range[0])
                .and(QMapSearchV2Result.mapSearchV2Result.period.start.loe(range[1])));

        return executeQueryAndAggregateResults(searchPredicate);
    }


    @SuppressWarnings("ParameterNumber")
    @GetMapping("markers")
    @Transactional(readOnly = true)
    public List<MapSearchMarkerResponseDto> searchMap(
            @RequestParam(value = "envelope", required = false) Envelope envelope,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "organisationType", required = false) List<OrganisationType> organisationTypes,
            @RequestParam(value = "activityTypes", required = false) List<ActivityType> activityTypes,
            @RequestParam(value = "includeExpiredActivities", defaultValue = "false") Boolean includeExpiredActivities,
            @RequestParam(value = "includeAllActionDays", defaultValue = "false") Boolean includeAllActionDays,
            @RequestParam(value = "includeNoCoords", defaultValue = "true") Boolean includeNoCoords,
            @RequestParam(value = "initiator", required = false) Boolean initiator,
            @RequestParam(value = "permanent", required = false) Boolean permanent,
            @RequestParam(value = "online", required = false) Boolean online,
            @RequestParam(value = "projectSustainabilityWinner", required = false) Boolean projectSustainabilityWinner,
            @QuerydslPredicate(root = MapSearchV2Result.class, bindings = MapSearchV2ResultBindingCustomizer.class)
            Predicate mapSearchFilterPredicate) {

        final BooleanBuilder searchPredicate =
                getSearchPredicate(envelope, query, location, organisationTypes, activityTypes,
                        includeExpiredActivities, includeNoCoords, initiator, permanent, online,
                        projectSustainabilityWinner, includeAllActionDays, mapSearchFilterPredicate);

        JPAQuery<MapMarkerView> jpaQuery =
                new JPAQuery<QMapSearchV2Result>(entityManager).from(QMapSearchV2Result.mapSearchV2Result)
                        .select(Projections.bean(MapMarkerView.class,
                                QMapSearchV2Result.mapSearchV2Result.activity.id.as("activityId"),
                                QMapSearchV2Result.mapSearchV2Result.organisation.id.as("organisationId"),
                                QMapSearchV2Result.mapSearchV2Result.resultType,
                                QMapSearchV2Result.mapSearchV2Result.location.coordinate,
                                QMapSearchV2Result.mapSearchV2Result.period)).where(searchPredicate);

        if (hasText(query)) {
            jpaQuery.orderBy(tsRankExpression(query).desc());
        }

        jpaQuery.orderBy(QMapSearchV2Result.mapSearchV2Result.modifiedAt.desc())
                .orderBy(QMapSearchV2Result.mapSearchV2Result.createdAt.desc());

        return jpaQuery.stream().map(mapper::mapSearchMarkerResponseDto).collect(Collectors.toUnmodifiableList());
    }

    private OrderSpecifier[] getOrderSpecifiers(Pageable pageable, Class klass) {

        // orderVariable must match the variable of FROM
        String className = klass.getSimpleName();
        final String orderVariable =
                String.valueOf(Character.toLowerCase(className.charAt(0))).concat(className.substring(1));

        return pageable.getSort().stream()
                .map(order -> new OrderSpecifier(
                        Order.valueOf(order.getDirection().toString()),
                        new PathBuilder(klass, orderVariable).get(order.getProperty()))
                )
                .toArray(OrderSpecifier[]::new);
    }

    private NumberTemplate<Integer> expiredExpression() {
        return Expressions.numberTemplate(Integer.class,
                "CASE WHEN {0} IS NOT NULL AND {0} < current_timestamp  THEN 1 ELSE 0 END",
                QMapSearchV2Result.mapSearchV2Result.period.end);
    }

    private NumberTemplate<Double> tsRankExpression(String query) {
        final String queryWithOr = fullTextSearchHelper.splitQuery(query);
        return Expressions.numberTemplate(Double.class, "ts_rank({0}, to_tsquery('german', {1}))",
                QMapSearchV2Result.mapSearchV2Result.nameAndDescriptionTsvec, queryWithOr);
    }

    @SuppressWarnings("ParameterNumber")
    private BooleanBuilder getSearchPredicate(Envelope envelope, String query, String location,
                                              List<OrganisationType> organisationTypes,
                                              List<ActivityType> activityTypes, boolean includeExpiredActivities,
                                              boolean includeDataWithoutCoordinates, Boolean initiator,
                                              Boolean permanent, Boolean online, Boolean projectSustainabilityWinner,
                                              Boolean includeAllActionDays, Predicate mapSearchFilterPredicate) {
        final BooleanBuilder searchPredicate = new BooleanBuilder(mapSearchFilterPredicate);

        buildCoordinatePredicate(searchPredicate, envelope, includeDataWithoutCoordinates);

        buildLocationPredicate(searchPredicate, location);

        buildTypePredicate(searchPredicate, includeAllActionDays, organisationTypes, activityTypes,
                includeExpiredActivities);

        buildQueryPredicate(searchPredicate, query);

        // buildExpiredActivitiesPredicate(searchPredicate, includeExpiredActivities);

        buildSpecialOrganisationsPredicate(searchPredicate, initiator, projectSustainabilityWinner);

        buildOnlinePredicate(searchPredicate, online);

        buildPermanentPredicate(searchPredicate, permanent);

        return searchPredicate;
    }


    private void buildCoordinatePredicate(BooleanBuilder searchPredicate, Envelope envelope,
                                          boolean includeDataWithoutCoordinates) {
        if (Objects.nonNull(envelope)) {
            BooleanExpression coordinateExpression =
                    QMapSearchV2Result.mapSearchV2Result.location.coordinate.within(factory.toGeometry(envelope));
            if (includeDataWithoutCoordinates) {
                coordinateExpression =
                        coordinateExpression.or(QMapSearchV2Result.mapSearchV2Result.location.coordinate.isNull());
            }
            searchPredicate.and(coordinateExpression);
        }
    }

    private void buildLocationPredicate(BooleanBuilder searchPredicate, String location) {
        if (hasText(location)) {
            // @formatter:off
            searchPredicate.and(
                    QMapSearchV2Result.mapSearchV2Result.location.address.street.containsIgnoreCase(location)
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.city.containsIgnoreCase(location)
                                    .or(QMapSearchV2Result.mapSearchV2Result.location.address.zipCode.containsIgnoreCase(location)
                                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.state.containsIgnoreCase(location))))
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.country.containsIgnoreCase(location)));
            // @formatter:on
        }
    }

    private void buildTypePredicate(BooleanBuilder searchPredicate, boolean includeAllActionDays,
                                    List<OrganisationType> organisationTypes,
                                    List<ActivityType> activityTypes, boolean includeExpiredActivities) {


        final BooleanBuilder typePredicate = new BooleanBuilder();
        boolean gotTypePredicate = false;
        if (Objects.nonNull(organisationTypes) && !organisationTypes.isEmpty()) {
            gotTypePredicate = true;
            typePredicate.or(QMapSearchV2Result.mapSearchV2Result.organisationType.in(organisationTypes)
                    .and(QMapSearchV2Result.mapSearchV2Result.activityType.isNull()));
        } else {
            typePredicate.or(QMapSearchV2Result.mapSearchV2Result.activityType.isNull());
        }

        if (CollectionUtils.isEmpty(activityTypes)) {
            activityTypes = Lists.newArrayList(DAN, EVENT);
        }

        if (!CollectionUtils.isEmpty(activityTypes)) {

            DanSetting danSetting = danRangeService.getDanSetting();

            /*if (!danSetting.active()) {
                activityTypes.remove(DAN);
                searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.resultType.ne(MapSearchResultType.DAN));
            }*/

            if (!CollectionUtils.isEmpty(activityTypes)) {
                gotTypePredicate = true;
                BooleanExpression orExpression = null;
                for (ActivityType activityType : activityTypes) {
                    BooleanExpression activityTypePredicate =
                            QMapSearchV2Result.mapSearchV2Result.activityType.eq(activityType);
                    if (activityType == ActivityType.DAN && !includeAllActionDays) {
                        activityTypePredicate = activityTypePredicate.and(
                                QMapSearchV2Result.mapSearchV2Result.period.start.goe(startOfYear())
                                        .and(QMapSearchV2Result.mapSearchV2Result.period.end.loe(endOfYear())));
                    } else if (activityType == ActivityType.EVENT && !includeExpiredActivities) {
                        final Instant now = Instant.now(clock);
                        searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.period.isNull()
                                .or(QMapSearchV2Result.mapSearchV2Result.period.end.after(now)));
                    }
                    orExpression =
                            orExpression == null ? activityTypePredicate : orExpression.or(activityTypePredicate);
                }
                typePredicate.or(orExpression);
            }
        }

        if (gotTypePredicate) {
            searchPredicate.and(typePredicate);
        }
    }

    private void buildQueryPredicate(BooleanBuilder searchPredicate, String query) {
        if (hasText(query)) {
            BooleanExpression searchFieldsForQuery = inNameOrDescription(query);
            searchFieldsForQuery = fullTextSearchHelper.orInOrganisationType(query, searchFieldsForQuery,
                    QMapSearchV2Result.mapSearchV2Result.organisationType);
            searchFieldsForQuery = fullTextSearchHelper.orInThematicFocus(query, searchFieldsForQuery,
                    QMapSearchV2Result.mapSearchV2Result.thematicFocus);
            searchFieldsForQuery = fullTextSearchHelper.orInActivityType(query, searchFieldsForQuery,
                    QMapSearchV2Result.mapSearchV2Result.activityType);
            searchFieldsForQuery = fullTextSearchHelper.orInSdgs(query, searchFieldsForQuery,
                    QMapSearchV2Result.mapSearchV2Result.sustainableDevelopmentGoals);
            searchPredicate.and(searchFieldsForQuery);
        }
    }


    private void buildExpiredActivitiesPredicate(BooleanBuilder searchPredicate, boolean includeExpiredActivities) {
        if (!includeExpiredActivities) {
            final Instant now = Instant.now(clock);
            searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.period.isNull()
                    .or(QMapSearchV2Result.mapSearchV2Result.period.end.after(now)));
        }
    }

    private void buildSpecialOrganisationsPredicate(BooleanBuilder searchPredicate, Boolean initiator,
                                                    Boolean projectSustainabilityWinner) {
        BooleanBuilder specialOrganisations = new BooleanBuilder();
        if (Objects.nonNull(initiator)) {
            specialOrganisations.or(QMapSearchV2Result.mapSearchV2Result.initiator.eq(initiator));
        }
        if (Objects.nonNull(projectSustainabilityWinner)) {
            specialOrganisations.or(
                    QMapSearchV2Result.mapSearchV2Result.projectSustainabilityWinner.eq(projectSustainabilityWinner));
        }
        if (specialOrganisations.hasValue()) {
            searchPredicate.and(specialOrganisations);
        }
    }

    private void buildOnlinePredicate(BooleanBuilder searchPredicate, Boolean online) {
        if (Objects.nonNull(online)) {
            if (online) {
                searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.location.online.eq(Boolean.TRUE));
            } else {
                searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.location.online.isNull()
                        .or(QMapSearchV2Result.mapSearchV2Result.location.online.eq(Boolean.FALSE)));
            }
        }
    }

    private void buildPermanentPredicate(BooleanBuilder searchPredicate, Boolean permanent) {
        if (Objects.nonNull(permanent)) {
            if (permanent) {
                searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.period.start.eq(PERMANENT_START)
                        .and(QMapSearchV2Result.mapSearchV2Result.period.end.eq(PERMANENT_END)));
            } else {
                searchPredicate.and(QMapSearchV2Result.mapSearchV2Result.period.start.ne(PERMANENT_START)
                        .or(QMapSearchV2Result.mapSearchV2Result.period.end.ne(PERMANENT_END)));
            }
        }
    }

    private BooleanExpression inNameOrDescription(String query) {
        final String queryWithOr = fullTextSearchHelper.splitQuery(query);
        BooleanExpression searchFieldsForQuery = fullTextSearchInNameOrDescription(queryWithOr);
        Splitter split = Splitter.on(CharMatcher.anyOf(" ")).trimResults().omitEmptyStrings();
        if (split.splitToList(query).size() == 1) {
            searchFieldsForQuery =
                    searchFieldsForQuery.or(QMapSearchV2Result.mapSearchV2Result.name.containsIgnoreCase(query))
                            .or(QMapSearchV2Result.mapSearchV2Result.description.containsIgnoreCase(query))
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.street.containsIgnoreCase(query))
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.city.containsIgnoreCase(query))
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.zipCode.containsIgnoreCase(query))
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.state.containsIgnoreCase(query))
                            .or(QMapSearchV2Result.mapSearchV2Result.location.address.country.containsIgnoreCase(
                                    query));
        }
        return searchFieldsForQuery;
    }

    private BooleanExpression fullTextSearchInNameOrDescription(String queryWithOr) {
        return fullTextSearchHelper.fullTextSearchInTsVector(
                QMapSearchV2Result.mapSearchV2Result.nameAndDescriptionTsvec, queryWithOr);
    }

    @SuppressWarnings("MagicNumber")
    private Instant endOfYear() {
        LocalDateTime endOfYear = LocalDateTime.of(LocalDate.now(clock).getYear(), 12, 31, 23, 59, 59);
        return endOfYear.atZone(DEFAULT_ZONE_ID).toInstant();
    }

    @SuppressWarnings("MagicNumber")
    private Instant startOfYear() {
        LocalDateTime startOfYear = LocalDateTime.of(LocalDate.now(clock).getYear(), 1, 1, 0, 0, 1);
        return startOfYear.atZone(DEFAULT_ZONE_ID).toInstant();
    }

    private Map<Instant, Integer> executeQueryAndAggregateResults(BooleanBuilder searchPredicate) {
        JPAQuery<MapSearchV2Result> jpaQuery = new JPAQuery<MapSearchV2Result>(entityManager)
                .from(QMapSearchV2Result.mapSearchV2Result)
                .where(searchPredicate);

        return jpaQuery.fetch().stream()
                .collect(Collectors.toMap(
                        result -> result.getPeriod().getStart(),
                        result -> 1,
                        Integer::sum
                ));
    }

    private Instant[] initMonthRange(Instant startDate) {
        LocalDateTime startDateTime = LocalDateTime.ofInstant(startDate, DEFAULT_ZONE_ID);


        LocalDateTime firstDayOfMonth = startDateTime.with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN);
        LocalDateTime lastDayOfMonth = startDateTime.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);


        Instant firstDayInstant = firstDayOfMonth.atZone(DEFAULT_ZONE_ID).toInstant();
        Instant lastDayInstant = lastDayOfMonth.atZone(DEFAULT_ZONE_ID).toInstant();

        return new Instant[] {firstDayInstant, lastDayInstant};
    }

}
