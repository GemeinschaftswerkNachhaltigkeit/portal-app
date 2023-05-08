package com.exxeta.wpgwn.wpgwnapp.organisation_membership;

import javax.annotation.security.RolesAllowed;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import com.querydsl.core.BooleanBuilder;

/**
 * Endpunkte für Organisations Nutzeradministratoren für RNE Admins.
 */
@RestController
@RolesAllowed(PermissionPool.RNE_ADMIN)
@RequestMapping("/api/v1/organisation-membership-admin")
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RneAdminOrganisationMembersController {

    private final OrganisationService organisationService;
    private final OrganisationMembershipService organisationMembershipService;

    /**
     * Fügt fehlende Administratoren in der Benutzerverwaltung aller Organisationen hinzu.
     */
    @PostMapping("add-missing-memberships")
    public void addMissingOrganisationMemberships() {
        BooleanBuilder predicate = new BooleanBuilder();
        Page<Organisation> organisations =
                organisationService.findAll(predicate, Pageable.unpaged());

        organisations.get().forEach(org -> {
            final Stream<OrganisationMembership> existingMemberships =
                    organisationMembershipService.getByOrganisation(org);
            if (existingMemberships.findAny().isEmpty()) {
                log.debug("Creating organisation membership entry for organisation [{}] - [{}]", org.getId(),
                        org.getName());
                organisationMembershipService.createOrganisationMembershipEntry(org);
            }
        });
    }

}
