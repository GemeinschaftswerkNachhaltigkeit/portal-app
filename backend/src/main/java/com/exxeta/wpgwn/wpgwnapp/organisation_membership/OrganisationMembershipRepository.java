package com.exxeta.wpgwn.wpgwnapp.organisation_membership;


import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;

public interface OrganisationMembershipRepository
        extends JpaRepository<OrganisationMembership, Long>,
        QuerydslPredicateExecutor<OrganisationMembership> {

    Optional<OrganisationMembership> findByRandomUniqueId(UUID uuid);

    Stream<OrganisationMembership> findAllByOrganisation(Organisation organisation);

    Optional<OrganisationMembership> findByOrganisationAndEmail(Organisation organisation, String email);

    void deleteByOrganisationIdAndEmail(long orgId, String email);

    void deleteAllByOrganisation(Organisation organisation);
}
