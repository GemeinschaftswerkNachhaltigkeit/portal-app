package com.exxeta.wpgwn.wpgwnapp.duplicate_check;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;

public interface DuplicateListRepository extends JpaRepository<DuplicateList, Long>,
        QuerydslPredicateExecutor<DuplicateList> {
    List<DuplicateList> findAllByOrganisationWorkInProgressIn(Collection<OrganisationWorkInProgress> organisations);

    Optional<DuplicateList> findByOrganisationWorkInProgress(OrganisationWorkInProgress organisation);

    void deleteAllByOrganisationWorkInProgress(OrganisationWorkInProgress organisation);

    Optional<DuplicateList> findByOrganisationWorkInProgressId(long orgWipId);

}
