package com.exxeta.wpgwn.wpgwnapp.organisation;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityService;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressService;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganisationDeletionService {

    private final OrganisationRepository organisationRepository;
    private final OrganisationWorkInProgressService organisationWorkInProgressService;
    private final ContactInviteService contactInviteService;
    private final DuplicateCheckService duplicateCheckService;
    private final ActivityService activityService;
    private final ActivityWorkInProgressService activityWorkInProgressService;
    private final OrganisationMembershipService organisationMembershipService;
    private final KeycloakService keycloakService;
    private final MarketplaceService marketplaceService;
    private final FileStorageService fileStorageService;

    @Transactional
    public void deleteOrganisation(@NotNull Organisation organisation) {
        organisationWorkInProgressService.deleteAllForOrganisation(organisation);
        duplicateCheckService.removeFromDuplicateLists(organisation);
        contactInviteService.deleteAllForOrganisation(organisation);
        organisationMembershipService.deleteAllByOrganisation(organisation);
        keycloakService.deleteOrganisationGroup(organisation.getKeycloakGroupId());
        activityWorkInProgressService.deleteAllForOrganisation(organisation);
        activityService.deleteActivitiesForOrganisation(organisation);
        marketplaceService.deleteMarketplaceItems(organisation);

        try {
            fileStorageService.deleteFileIfPresent(organisation.getLogo());
            fileStorageService.deleteFileIfPresent(organisation.getImage());
            if (Objects.nonNull(organisation.getContact())) {
                fileStorageService.deleteFileIfPresent(organisation.getContact().getImage());
            }
        } catch (IOException e) {
            log.warn("Unexpected error while deleting images for organisation [{}]", organisation.getId(), e);
        }

        organisationRepository.delete(organisation);

    }
}
