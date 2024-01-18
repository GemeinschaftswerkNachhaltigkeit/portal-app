package com.exxeta.wpgwn.wpgwnapp.map_search;

import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.DanSetting;
import com.exxeta.wpgwn.wpgwnapp.hibernate.FullTextSearchHelper;
import com.exxeta.wpgwn.wpgwnapp.map_search.dto.MapSearchMarkerResponseDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.dto.MapSearchResultWrapperDto;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapMarkerView;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapSearchResult;
import com.exxeta.wpgwn.wpgwnapp.map_search.model.QMapSearchResult;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SustainableDevelopmentGoals;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

import com.google.common.base.CharMatcher;
import com.google.common.base.Joiner;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;

import lombok.RequiredArgsConstructor;

import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper.PERMANENT_END;
import static com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper.PERMANENT_START;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.DAN;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.EVENT;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class MapSearchController {

    private final MapSearchResultRepository mapSearchResultRepository;
    private final GeometryFactory factory;
    private final MapSearchResultMapper mapper;
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
            @RequestParam(value = "includeNoCoords", defaultValue = "true") Boolean includeNoCoords,
            @RequestParam(value = "initiator", required = false) Boolean initiator,
            @RequestParam(value = "permanent", required = false) Boolean permanent,
            @RequestParam(value = "online", required = false) Boolean online,
            @RequestParam(value = "projectSustainabilityWinner", required = false) Boolean projectSustainabilityWinner,
            @QuerydslPredicate(root = MapSearchResult.class, bindings = MapSearchResultBindingCustomizer.class)
            Predicate mapSearchFilterPredicate,
            Pageable pageable) {
        final BooleanBuilder searchPredicate =
                getSearchPredicate(envelope, query, location, organisationTypes, activityTypes,
                        includeExpiredActivities, includeNoCoords, initiator, permanent, online,
                        projectSustainabilityWinner,
                        mapSearchFilterPredicate);

        final Page<MapSearchResult> activitiesPage = mapSearchResultRepository.findAll(searchPredicate, pageable);
        return activitiesPage.map(mapper::mapSearchResultToDto);
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
            @RequestParam(value = "includeNoCoords", defaultValue = "true") Boolean includeNoCoords,
            @RequestParam(value = "initiator", required = false) Boolean initiator,
            @RequestParam(value = "permanent", required = false) Boolean permanent,
            @RequestParam(value = "online", required = false) Boolean online,
            @RequestParam(value = "projectSustainabilityWinner", required = false)
            Boolean projectSustainabilityWinner,
            @QuerydslPredicate(root = MapSearchResult.class, bindings = MapSearchResultBindingCustomizer.class)
            Predicate mapSearchFilterPredicate
    ) {

        final BooleanBuilder searchPredicate =
                getSearchPredicate(envelope, query, location, organisationTypes, activityTypes,
                        includeExpiredActivities, includeNoCoords, initiator, permanent, online,
                        projectSustainabilityWinner,
                        mapSearchFilterPredicate);

        return new JPAQuery<>(entityManager)
                .from(QMapSearchResult.mapSearchResult)
                .select(Projections.bean(MapMarkerView.class,
                        QMapSearchResult.mapSearchResult.activity.id.as("activityId"),
                        QMapSearchResult.mapSearchResult.organisation.id.as("organisationId"),
                        QMapSearchResult.mapSearchResult.resultType,
                        QMapSearchResult.mapSearchResult.location.coordinate))
                .where(searchPredicate)
                .stream()
                .map(mapper::mapSearchMarkerResponseDto)
                .collect(Collectors.toUnmodifiableList());
    }

    @SuppressWarnings("ParameterNumber")
    private BooleanBuilder getSearchPredicate(Envelope envelope, String query, String location,
                                              List<OrganisationType> organisationTypes,
                                              List<ActivityType> activityTypes,
                                              boolean includeExpiredActivities,
                                              boolean includeDataWithoutCoordinates,
                                              Boolean initiator,
                                              Boolean permanent,
                                              Boolean online,
                                              Boolean projectSustainabilityWinner,
                                              Predicate mapSearchFilterPredicate) {
        final BooleanBuilder searchPredicate = new BooleanBuilder(mapSearchFilterPredicate);

        buildCoordinatePredicate(searchPredicate, envelope, includeDataWithoutCoordinates);

        buildLocationPredicate(searchPredicate, location);

        buildTypePredicate(searchPredicate, organisationTypes, activityTypes);

        buildQueryPredicate(searchPredicate, query);

        buildExpiredActivitiesPredicate(searchPredicate, includeExpiredActivities);

        buildSpecialOrganisationsPredicate(searchPredicate, initiator, projectSustainabilityWinner);

        buildOnlinePredicate(searchPredicate, online);

        buildPermanentPredicate(searchPredicate, permanent);

        return searchPredicate;
    }

    private void buildCoordinatePredicate(BooleanBuilder searchPredicate, Envelope envelope,
                                          boolean includeDataWithoutCoordinates) {
        if (Objects.nonNull(envelope)) {
            BooleanExpression coordinateExpression = QMapSearchResult.mapSearchResult.location.coordinate
                    .within(factory.toGeometry(envelope));
            if (includeDataWithoutCoordinates) {
                coordinateExpression =
                        coordinateExpression.or(QMapSearchResult.mapSearchResult.location.coordinate.isNull());
            }
            searchPredicate.and(coordinateExpression);
        }
    }

    private void buildLocationPredicate(BooleanBuilder searchPredicate, String location) {
        if (StringUtils.hasText(location)) {
            // @formatter:off
            searchPredicate.and(
                    QMapSearchResult.mapSearchResult.location.address.street.containsIgnoreCase(location)
                            .or(QMapSearchResult.mapSearchResult.location.address.city.containsIgnoreCase(location)
                                    .or(QMapSearchResult.mapSearchResult.location.address.zipCode.containsIgnoreCase(location)
                                            .or(QMapSearchResult.mapSearchResult.location.address.state.containsIgnoreCase(location))))
                            .or(QMapSearchResult.mapSearchResult.location.address.country.containsIgnoreCase(location)));
            // @formatter:on
        }
    }

    private void buildTypePredicate(BooleanBuilder searchPredicate, List<OrganisationType> organisationTypes,
                                    List<ActivityType> activityTypes) {


        final BooleanBuilder typePredicate = new BooleanBuilder();
        boolean gotTypePredicate = false;
        if (Objects.nonNull(organisationTypes) && !organisationTypes.isEmpty()) {
            gotTypePredicate = true;
            typePredicate.or(
                    QMapSearchResult.mapSearchResult.organisationType.in(organisationTypes)
                            .and(QMapSearchResult.mapSearchResult.activityType.isNull())
            );
        } else {
            typePredicate.or(QMapSearchResult.mapSearchResult.activityType.isNull());
        }

        if (CollectionUtils.isEmpty(activityTypes)) {
            activityTypes = Lists.newArrayList(DAN, EVENT);
        }

        if (!CollectionUtils.isEmpty(activityTypes)) {

            DanSetting danSetting = danRangeService.getDanSetting();

            if (!danSetting.active()) {
                activityTypes.remove(DAN);
                searchPredicate.and(QMapSearchResult.mapSearchResult.resultType.ne(MapSearchResultType.DAN));
            }

            if (!CollectionUtils.isEmpty(activityTypes)) {
                gotTypePredicate = true;
                BooleanExpression orExpression = null;
                for (ActivityType activityType : activityTypes) {
                    BooleanExpression activityTypePredicate =
                            QMapSearchResult.mapSearchResult.activityType.eq(activityType);
                    if (activityType == ActivityType.DAN) {
                        activityTypePredicate = activityTypePredicate
                                .and(QMapSearchResult.mapSearchResult.period.start.goe(danSetting.startMin()))
                                .and(QMapSearchResult.mapSearchResult.period.end.loe(danSetting.endMax()));
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
        if (StringUtils.hasText(query)) {
            final String queryWithOr = fullTextSearchHelper.splitQuery(query);
            BooleanExpression searchFieldsForQuery = inNameOrDescription(queryWithOr);
            searchFieldsForQuery = searchFieldsForQuery.or(inContactPersonNameOrPosition(queryWithOr));
            searchFieldsForQuery = orInOrganisationType(queryWithOr, searchFieldsForQuery);
            searchFieldsForQuery = orInThematicFocus(queryWithOr, searchFieldsForQuery);
            searchFieldsForQuery = orInActivityType(queryWithOr, searchFieldsForQuery);
            searchFieldsForQuery = orInSdgs(queryWithOr, searchFieldsForQuery);

            searchPredicate.and(searchFieldsForQuery);
        }
    }

    private String splitQuery(String query) {
        Splitter split = Splitter.on(CharMatcher.anyOf(" ")).trimResults()
                .omitEmptyStrings();
        return Joiner.on(" | ").skipNulls()
                .join(split.split(query));
    }

    private void buildExpiredActivitiesPredicate(BooleanBuilder searchPredicate, boolean includeExpiredActivities) {
        if (!includeExpiredActivities) {
            final Instant now = Instant.now(clock);
            searchPredicate.and(QMapSearchResult.mapSearchResult.period.isNull()
                    .or(QMapSearchResult.mapSearchResult.period.end.after(now)));
        }
    }

    private void buildSpecialOrganisationsPredicate(BooleanBuilder searchPredicate, Boolean initiator,
                                                    Boolean projectSustainabilityWinner) {
        BooleanBuilder specialOrganisations = new BooleanBuilder();
        if (Objects.nonNull(initiator)) {
            specialOrganisations.or(QMapSearchResult.mapSearchResult.initiator.eq(initiator));
        }
        if (Objects.nonNull(projectSustainabilityWinner)) {
            specialOrganisations.or(
                    QMapSearchResult.mapSearchResult.projectSustainabilityWinner.eq(projectSustainabilityWinner));
        }
        if (specialOrganisations.hasValue()) {
            searchPredicate.and(specialOrganisations);
        }
    }

    private void buildOnlinePredicate(BooleanBuilder searchPredicate, Boolean online) {
        if (Objects.nonNull(online)) {
            if (online) {
                searchPredicate.and(QMapSearchResult.mapSearchResult.location.online.eq(Boolean.TRUE));
            } else {
                searchPredicate.and(QMapSearchResult.mapSearchResult.location.online.isNull()
                        .or(QMapSearchResult.mapSearchResult.location.online.eq(Boolean.FALSE)));
            }
        }
    }

    private void buildPermanentPredicate(BooleanBuilder searchPredicate, Boolean permanent) {
        if (Objects.nonNull(permanent)) {
            if (permanent) {
                searchPredicate.and(
                        QMapSearchResult.mapSearchResult.period.start.eq(PERMANENT_START)
                                .and(QMapSearchResult.mapSearchResult.period.end.eq(PERMANENT_END)));
            } else {
                searchPredicate.and(
                        QMapSearchResult.mapSearchResult.period.start.ne(PERMANENT_START)
                                .or(QMapSearchResult.mapSearchResult.period.end.ne(PERMANENT_END)));
            }
        }
    }


    private BooleanExpression inNameOrDescription(String query) {
        // @formatter:off
        BooleanExpression nameOrDescriptionQuery =
                fullTextSearchHelper.fullTextSearchInTsVector(QMapSearchResult.mapSearchResult.nameTsvec, query)
                        .or(fullTextSearchHelper.fullTextSearchInTsVector(QMapSearchResult.mapSearchResult.descriptionTsvec, query));
        // @formatter:on

        // Contains Suche im Fall eines Suchbegriffs.
        if (query.trim().split(" ").length == 1) {
            nameOrDescriptionQuery = nameOrDescriptionQuery
                    .or(QMapSearchResult.mapSearchResult.name.containsIgnoreCase(query))
                    .or(QMapSearchResult.mapSearchResult.description.containsIgnoreCase(query));
        }

        return nameOrDescriptionQuery;
    }

    private BooleanExpression inContactPersonNameOrPosition(String query) {
        // @formatter:off
        BooleanExpression personNameOrPositionQuery =
        fullTextSearchHelper.fullTextSearchInTsVector(QMapSearchResult.mapSearchResult.contactWithTsVector.lastNameTsVec, query)
                .or(fullTextSearchHelper.fullTextSearchInTsVector(QMapSearchResult.mapSearchResult.contactWithTsVector.firstNameTsVec, query))
                .or(fullTextSearchHelper.fullTextSearchInTsVector(QMapSearchResult.mapSearchResult.contactWithTsVector.positionTsVec, query));


        // Contains Suche im Fall eines Suchbegriffs.
        if (query.trim().split(" ").length == 1) {
            personNameOrPositionQuery = personNameOrPositionQuery
                    .or(QMapSearchResult.mapSearchResult.contactWithTsVector.lastName.containsIgnoreCase(query))
                    .or(QMapSearchResult.mapSearchResult.contactWithTsVector.firstName.containsIgnoreCase(query))
                    .or(QMapSearchResult.mapSearchResult.contactWithTsVector.position.containsIgnoreCase(query));
        }
        // @formatter:on
        return personNameOrPositionQuery;
    }

    private BooleanExpression orInThematicFocus(String query, BooleanExpression searchFieldsForQuery) {

        final Set<ThematicFocus> fullTextThematicFocus =
                fullTextSearchHelper.getMatchingValues(ThematicFocus.class, query);
        if (!fullTextThematicFocus.isEmpty()) {
            for (ThematicFocus tm : fullTextThematicFocus) {
                searchFieldsForQuery = searchFieldsForQuery.or(
                        QMapSearchResult.mapSearchResult.thematicFocus.containsIgnoreCase(tm.name()));
            }
        }
        return searchFieldsForQuery;
    }

    private BooleanExpression orInSdgs(String query, BooleanExpression searchFieldsForQuery) {
        final Set<SustainableDevelopmentGoals> fullTextSdgs =
                fullTextSearchHelper.getMatchingValues(SustainableDevelopmentGoals.class, query);
        if (!fullTextSdgs.isEmpty()) {
            for (SustainableDevelopmentGoals sdg : fullTextSdgs) {
                searchFieldsForQuery = searchFieldsForQuery.or(
                        QMapSearchResult.mapSearchResult.sustainableDevelopmentGoals.containsIgnoreCase(sdg.name()));
            }
        }
        return searchFieldsForQuery;
    }

    private BooleanExpression orInOrganisationType(String query, BooleanExpression searchFieldsForQuery) {
        final Set<OrganisationType> fullTextOrganisationTypes =
                fullTextSearchHelper.getMatchingValues(OrganisationType.class, query);
        if (!fullTextOrganisationTypes.isEmpty()) {
            searchFieldsForQuery = searchFieldsForQuery.or(
                    QMapSearchResult.mapSearchResult.organisationType.in(fullTextOrganisationTypes));
        }
        return searchFieldsForQuery;
    }

    private BooleanExpression orInActivityType(String query, BooleanExpression searchFieldsForQuery) {
        final Set<ActivityType> fullTextActivityTypes =
                fullTextSearchHelper.getMatchingValues(ActivityType.class, query);
        if (!fullTextActivityTypes.isEmpty()) {
            searchFieldsForQuery = searchFieldsForQuery.or(
                    QMapSearchResult.mapSearchResult.activityType.in(fullTextActivityTypes));
        }
        return searchFieldsForQuery;
    }

}
