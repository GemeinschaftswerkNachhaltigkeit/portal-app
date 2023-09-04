package com.exxeta.wpgwn.wpgwnapp.activity;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity.projection.ClusteredActivity;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long>,
        RevisionRepository<Activity, Long, Long>,
        QuerydslPredicateExecutor<Activity> {


    Page<Activity> findAllByOrganisationIdIs(Long organisationId, Pageable pageable);

    @Query(value = "SELECT * "
            + "FROM activity "
            + "WHERE coordinate && ST_MakeEnvelope(:envelope)", nativeQuery = true)
    Page<Activity> findAllInEnvelope(List<Number> envelope, Pageable pageable);


    @Query(value = "SELECT * "
            + "FROM activity "
            + "WHERE  activity_type IN (:activityTypes)", nativeQuery = true)
    Page<Activity> findAllInActivityTypes(@Param("activityTypes") List<String> activityTypes,
                                          Pageable pageable);

    @Query(value = "SELECT * "
            + "FROM activity "
            + "WHERE activity_type IN (:activityTypes) AND organisation_id =:organisationId", nativeQuery = true)
    Page<Activity> findAllInActivityTypesAndByOrganisationId(@Param("activityTypes") List<String> activityTypes,
                                                             @Param("organisationId") Long organisationId,
                                                             Pageable pageable);

    @Query(value = "SELECT st_astext(ST_Centroid(ST_Collect(geom))) as coordinate,"
            + "        count(clstr_id) as number_points,"
            + "        (array_agg(init_id))[1] as first_activity_id, "
            + "        (array_agg(contact_name))[1] as first_activity_name "
            +
            "FROM ( SELECT ST_ClusterDBSCAN(coordinate, :epsDistance, 1) OVER() AS clstr_id, coordinate as geom, id as init_id, contact_name"
            + "         FROM activity WHERE coordinate && ST_MakeEnvelope(:envelope)) as cluster_table "
            + "GROUP BY clstr_id ORDER BY clstr_id",
            nativeQuery = true)
    Page<ClusteredActivity> findAllInEnvelopeClusters(List<Number> envelope, double epsDistance, Pageable pageable);

    List<Activity> findAllByOrganisation(Organisation organisation);


    List<Activity> findByPeriodStartBetween(Instant start, Instant end);


    Activity findActivityByExternalIdAndSource(String externalId, Source source);


    @Transactional(readOnly = true)
    long countActivitiesByActivityTypeAndStatusAndCreatedBy(ActivityType activityType, ItemStatus status,
                                                            String createdBy);

    @Transactional(readOnly = true)
    long countActivitiesByActivityTypeAndStatusAndOrganisation(ActivityType activityType, ItemStatus status,
                                                               Organisation organisation);

}
