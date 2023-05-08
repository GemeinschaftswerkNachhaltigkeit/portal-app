package com.exxeta.wpgwn.wpgwnapp.organisation;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface OrganisationRepository
        extends JpaRepository<Organisation, Long>,
        QuerydslPredicateExecutor<Organisation> {


}
