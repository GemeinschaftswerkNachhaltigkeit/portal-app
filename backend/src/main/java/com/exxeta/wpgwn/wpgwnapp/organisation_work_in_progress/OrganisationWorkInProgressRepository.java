package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

public interface OrganisationWorkInProgressRepository extends JpaRepository<OrganisationWorkInProgress, Long>,
        QuerydslPredicateExecutor<OrganisationWorkInProgress> {

    Optional<OrganisationWorkInProgress> findByRandomUniqueId(UUID randomUniqueId);

    List<OrganisationWorkInProgress> findAllByImportProcessId(Long importProcessId);

    List<OrganisationWorkInProgress> findAllByOrganisation(Organisation organisation);

}
