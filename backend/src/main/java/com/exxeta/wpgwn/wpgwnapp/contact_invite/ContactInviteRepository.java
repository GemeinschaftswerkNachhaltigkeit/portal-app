package com.exxeta.wpgwn.wpgwnapp.contact_invite;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.history.RevisionRepository;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;

public interface ContactInviteRepository extends JpaRepository<ContactInvite, Long>,
        RevisionRepository<ContactInvite, Long, Long>,
        QuerydslPredicateExecutor<ContactInvite> {

    Optional<ContactInvite> findByRandomUniqueId(UUID uuid);

    List<ContactInvite> findAllByOrganisationWorkInProgress(OrganisationWorkInProgress organisationWorkInProgress);

    List<ContactInvite> findAllByOrganisationWorkInProgressAndStatus(
            OrganisationWorkInProgress organisationWorkInProgress, ContactInviteStatus status);

    List<ContactInvite> findAllByOrganisationAndStatus(Organisation organisation, ContactInviteStatus status);

    void deleteAllByOrganisation(Organisation organisation);

    List<ContactInvite> findAllByActivityAndStatus(Activity activity, ContactInviteStatus status);

    List<ContactInvite> findAllByActivity(Activity activity);

}
