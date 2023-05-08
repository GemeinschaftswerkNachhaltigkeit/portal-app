package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import java.util.Objects;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.event.AddDanToOrganisationEvent;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.event.OrganisationUpdateEvent;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.PublishedEmailContentGeneratorWithOptOutCheck;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;

/**
 * Service zum Veröffentlichen von Organisationen (Arbeitsstand). Die Organisation wird gelöscht und als
 * "richtige" Organisation angelegt. Die DuplikatListen werden entsprechend aktualisiert.
 *
 * @author schlegti
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OrganisationWorkInProgressPublishService {

    private final OrganisationService organisationService;

    private final ActivityWorkInProgressService activityWorkInProgressService;

    private final OrganisationWorkInProgressRepository workInProgressRepository;

    private final KeycloakService keycloakService;

    private final DuplicateCheckService duplicateCheckService;

    private final ContactInviteService contactInviteService;

    private final OrganisationMembershipService organisationMembershipService;

    private final PublishedEmailContentGeneratorWithOptOutCheck publishedEmailContentGenerator;

    private final EmailService emailService;

    private final OrganisationMapper organisationMapper;

    private final ApplicationEventPublisher applicationEventPublisher;

    private final FileStorageService fileStorageService;

    /**
     * Veröffentlichung der Organisation. Angehängte Aktivitäten (WIP) werden an die Organisation gehängt und nicht
     * veröffentlicht. Diese müssen separat veröffentlicht werden.
     */
    @Transactional
    public Organisation publishOrganisationWorkInProgress(OrganisationWorkInProgress workInProgress) {
        final Organisation organisation =
                Optional.ofNullable(workInProgress.getOrganisation()).orElse(new Organisation());

        final boolean logoHasChanged = !Objects.equals(workInProgress.getLogo(), organisation.getLogo());
        final String logoPath = organisation.getLogo();
        final boolean imageHasChanged = !Objects.equals(workInProgress.getImage(), organisation.getImage());
        final String imagePath = organisation.getImage();
        final boolean contactImageHasChanged = !Objects.equals(getWorkInProgressContactImage(workInProgress),
                organisationService.getContactImage(organisation));
        final String contactImagePath = organisationService.getContactImage(organisation);

        organisationMapper.mapWorkInProgressToOrganisationWithoutActivities(workInProgress, organisation);
        final Organisation savedOrganisation = organisationService.save(organisation);

        workInProgress.getActivitiesWorkInProgress().forEach(activityWorkInProgress -> {
            activityWorkInProgress.setOrganisationWorkInProgress(null);
            activityWorkInProgress.setOrganisation(savedOrganisation);
            activityWorkInProgressService.save(activityWorkInProgress);
        });

        duplicateCheckService.updatePublishedOrganisation(workInProgress, savedOrganisation);
        contactInviteService.updatePublishedOrganisation(workInProgress, savedOrganisation);

        if (workInProgress.getStatus() != OrganisationStatus.AKTUALISIERUNG_ORGANISATION) {
            keycloakService.updateOrganisationWorkInProgressToOrganisation(savedOrganisation);
            organisationMembershipService.createOrganisationMembershipEntry(savedOrganisation);
        }

        workInProgressRepository.deleteById(workInProgress.getId());

        fileStorageService.deleteIfChanged(logoHasChanged, logoPath);
        fileStorageService.deleteIfChanged(imageHasChanged, imagePath);
        fileStorageService.deleteIfChanged(contactImageHasChanged, contactImagePath);

        if (workInProgress.getStatus() != OrganisationStatus.AKTUALISIERUNG_ORGANISATION) {
            sendOrganisationPublishedEmail(savedOrganisation);
            applicationEventPublisher.publishEvent(new AddDanToOrganisationEvent(savedOrganisation.getId()));
        }

        applicationEventPublisher.publishEvent(new OrganisationUpdateEvent(savedOrganisation));
        return savedOrganisation;
    }

    void sendOrganisationPublishedEmail(Organisation organisation) {
        emailService.sendMail(publishedEmailContentGenerator, organisation);
    }

    public String getWorkInProgressContactImage(OrganisationWorkInProgress workInProgress) {
        return Optional.ofNullable(workInProgress)
                .map(OrganisationWorkInProgress::getContactWorkInProgress)
                .map(ContactWorkInProgress::getImage)
                .orElse(null);
    }
}
