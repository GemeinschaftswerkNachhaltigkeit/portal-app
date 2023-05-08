package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;

@SuppressWarnings("MethodName")
public interface ActivityWorkInProgressRepository extends JpaRepository<ActivityWorkInProgress, Long>,
        QuerydslPredicateExecutor<ActivityWorkInProgress> {

    Optional<ActivityWorkInProgress> findByRandomUniqueId(UUID randomUniqueId);

    List<ActivityWorkInProgress> findAllByImportProcessId(Long importProcessId);

    void deleteActivityWorkInProgressByActivity(Activity activity);

    Stream<ActivityWorkInProgress> findAllByActivity(Activity activity);

    Page<ActivityWorkInProgress> findAllByOrganisation(Organisation organisation, Pageable pageable);

    void deleteAllByOrganisationWorkInProgress(OrganisationWorkInProgress orgWip);

    void deleteAllByOrganisation(Organisation organisation);
}
