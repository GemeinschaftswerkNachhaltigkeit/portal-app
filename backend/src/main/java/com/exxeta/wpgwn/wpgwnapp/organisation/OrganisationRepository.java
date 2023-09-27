package com.exxeta.wpgwn.wpgwnapp.organisation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

public interface OrganisationRepository
        extends JpaRepository<Organisation, Long>,
        QuerydslPredicateExecutor<Organisation> {


}
