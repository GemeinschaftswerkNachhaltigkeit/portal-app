package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.FeedbackEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.PrivacyConsentEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.RejectionEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.ReminderEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.utils.ProfileService;

import com.querydsl.core.types.Predicate;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganisationWorkInProgressService {

    private static final List<Source> SOURCES_WITHOUT_CLEARING = List.of(Source.IMPORT);

    private final OrganisationWorkInProgressRepository workInProgressRepository;

    private final FeedbackHistoryEntryRepository feedbackHistoryEntryRepository;

    private final ActivityWorkInProgressService activityWorkInProgressService;

    private final FileStorageService fileStorageService;

    private final EmailService emailService;

    private final DuplicateCheckService duplicateCheckService;

    private final KeycloakService keycloakService;

    private final ContactInviteService contactInviteService;

    private final OrganisationWorkInProgressPublishService organisationWorkInProgressPublishService;

    private final ReminderEmailContentGenerator reminderEmailContentGenerator;

    private final FeedbackEmailContentGenerator feedbackEmailContentGenerator;

    private final RejectionEmailContentGenerator rejectionEmailContentGenerator;

    private final PrivacyConsentEmailContentGenerator privacyConsentEmailContentGenerator;

    private final ProfileService profileService;

    private final Clock clock;

    /**
     * Sendet eine E-Mail mit einem Link zum Aktualisieren der Organisations (WIP)
     *
     * @param organisationWorkInProgressId
     */
    public void sendReminderEmail(@NonNull Long organisationWorkInProgressId) {
        if (!profileService.isProdActive()) {
            log.warn("System is not running in Prod Mode. Reminder E-Mails are disabled.");
            return;
        }

        findById(organisationWorkInProgressId).ifPresent(organisationWorkInProgress -> {
            emailService.sendMail(reminderEmailContentGenerator, organisationWorkInProgress);

            organisationWorkInProgress.getEmailNotificationDates().add(Instant.now(clock));
            workInProgressRepository.save(organisationWorkInProgress);
        });
    }

    /**
     * Sendet eine E-Mail mit einem Link zum Aktualisieren der Organisations (WIP)
     *
     * @param organisationWorkInProgressId
     */
    @Transactional
    public void sendPrivacyConsentEmail(@NonNull Long organisationWorkInProgressId) {
        if (!profileService.isProdActive()) {
            log.warn("System is not running in Prod Mode. Reminder E-Mails are disabled.");
            return;
        }

        findById(organisationWorkInProgressId)
                .ifPresent(organisationWorkInProgress -> {
                            emailService.sendMail(privacyConsentEmailContentGenerator, organisationWorkInProgress);
                            organisationWorkInProgress.getEmailNotificationDates().add(Instant.now(clock));
                            workInProgressRepository.save(organisationWorkInProgress);
                        }
                );
    }


    /**
     * Versendet die E-Mail mit Rückfragen zum eingerichten Organisation.
     *
     * @param organisationWorkInProgress die Organisation
     * @param feedback
     * @return
     */
    public OrganisationWorkInProgress sendFeedbackEmail(OrganisationWorkInProgress organisationWorkInProgress,
                                                        String feedback) {
        final Instant requestSent = Instant.now(clock);
        organisationWorkInProgress.setFeedbackRequest(feedback);
        organisationWorkInProgress.setFeedbackRequestSent(requestSent);

        final FeedbackHistoryEntry feedbackEntry = new FeedbackHistoryEntry();
        feedbackEntry.setOrganisationWorkInProgress(organisationWorkInProgress);
        feedbackEntry.setFeedbackRequest(feedback);
        feedbackEntry.setFeedbackRequestSent(requestSent);
        final FeedbackHistoryEntry savedFeedbackEntry = feedbackHistoryEntryRepository.save(feedbackEntry);
        organisationWorkInProgress.getFeedbackRequestList().add(savedFeedbackEntry);

        organisationWorkInProgress.setStatus(OrganisationStatus.RUECKFRAGE_CLEARING);
        emailService.sendMail(feedbackEmailContentGenerator, organisationWorkInProgress);
        return save(organisationWorkInProgress);
    }

    public OrganisationWorkInProgress rejectOrganisation(OrganisationWorkInProgress organisationWorkInProgress,
                                                         String rejectionReason) {
        organisationWorkInProgress.setRejectionReason(rejectionReason);
        organisationWorkInProgress.setStatus(OrganisationStatus.FREIGABE_VERWEIGERT_CLEARING);

        emailService.sendMail(rejectionEmailContentGenerator, organisationWorkInProgress);
        final OrganisationWorkInProgress saveOrganisationWorkInProgress = save(organisationWorkInProgress);

        keycloakService.deleteOrganisationGroup(organisationWorkInProgress.getKeycloakGroupId());
        log.debug("Deleted keycloak group [{}] due to rejection of the organisation [{}]",
                organisationWorkInProgress.getKeycloakGroupId(), organisationWorkInProgress.getId());

        return saveOrganisationWorkInProgress;
    }

    Iterable<OrganisationWorkInProgress> findAllByPredicate(@NonNull Predicate predicate) {
        return workInProgressRepository.findAll(predicate);
    }

    Page<OrganisationWorkInProgress> findAllByPredicate(@NonNull Predicate predicate, Pageable pageable) {
        return workInProgressRepository.findAll(predicate, pageable);
    }

    Page<OrganisationWorkInProgress> findAll(@NonNull Pageable pageable) {
        return workInProgressRepository.findAll(pageable);
    }

    public OrganisationWorkInProgress saveOrganisationLogo(OrganisationWorkInProgress organisationWorkInProgress,
                                                           MultipartFile file) throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final String logo = organisationWorkInProgress.getLogo();

        if (Objects.isNull(organisationWorkInProgress.getOrganisation())
                || !Objects.equals(organisationWorkInProgress.getOrganisation().getLogo(), logo)) {
            fileStorageService.deleteFileIfPresent(logo);
        }

        organisationWorkInProgress.setLogo(filename);
        return workInProgressRepository.save(organisationWorkInProgress);
    }

    public void deleteOrganisationLogo(OrganisationWorkInProgress organisationWorkInProgress)
            throws IOException {
        final String logo = organisationWorkInProgress.getLogo();
        if (Objects.isNull(organisationWorkInProgress.getOrganisation())
                || !Objects.equals(organisationWorkInProgress.getOrganisation().getLogo(), logo)) {
            fileStorageService.deleteFileIfPresent(logo);
        }
        organisationWorkInProgress.setLogo(null);
    }

    public OrganisationWorkInProgress saveOrganisationImage(OrganisationWorkInProgress organisationWorkInProgress,
                                                            MultipartFile file) throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final String image = organisationWorkInProgress.getImage();
        if (Objects.isNull(organisationWorkInProgress.getOrganisation())
                || !Objects.equals(organisationWorkInProgress.getOrganisation().getImage(), image)) {
            fileStorageService.deleteFileIfPresent(image);
        }

        organisationWorkInProgress.setImage(filename);
        return workInProgressRepository.save(organisationWorkInProgress);
    }

    public void deleteOrganisationImage(OrganisationWorkInProgress organisationWorkInProgress)
            throws IOException {
        final String image = organisationWorkInProgress.getImage();
        if (Objects.isNull(organisationWorkInProgress.getOrganisation())
                || !Objects.equals(organisationWorkInProgress.getOrganisation().getImage(), image)) {
            fileStorageService.deleteFileIfPresent(image);
        }
        organisationWorkInProgress.setImage(null);
    }

    public OrganisationWorkInProgress saveOrganisationContactImageLogo(
            OrganisationWorkInProgress organisationWorkInProgress, MultipartFile file) throws IOException {
        final String filename = fileStorageService.saveFile(file);
        final ContactWorkInProgress contactWorkInProgress = getContactWorkInProgress(organisationWorkInProgress);
        final String contactImage = contactWorkInProgress.getImage();

        if (Objects.isNull(organisationWorkInProgress.getOrganisation())
                || !Objects.equals(getContactImageOfReferencedOrganisation(organisationWorkInProgress), contactImage)) {
            fileStorageService.deleteFileIfPresent(contactImage);
        }
        contactWorkInProgress.setImage(filename);
        return workInProgressRepository.save(organisationWorkInProgress);
    }

    public void deleteOrganisationContactImageLogo(
            OrganisationWorkInProgress organisationWorkInProgress) throws IOException {
        final ContactWorkInProgress contactWorkInProgress = getContactWorkInProgress(organisationWorkInProgress);
        final String contactImage = contactWorkInProgress.getImage();
        if (Objects.isNull(organisationWorkInProgress.getOrganisation())
                || !Objects.equals(getContactImageOfReferencedOrganisation(organisationWorkInProgress), contactImage)) {
            fileStorageService.deleteFileIfPresent(contactImage);
        }
        contactWorkInProgress.setImage(null);
    }

    private ContactWorkInProgress getContactWorkInProgress(
            OrganisationWorkInProgress organisationWorkInProgress) {
        return Optional.ofNullable(organisationWorkInProgress.getContactWorkInProgress())
                .orElseGet(() -> {
                    final ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
                    organisationWorkInProgress.setContactWorkInProgress(contactWorkInProgress);
                    return contactWorkInProgress;
                });
    }

    OrganisationWorkInProgress getOrganisationWorkInProgressById(long id) {
        return workInProgressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "OrganisationWorkInProgress", id)));
    }

    OrganisationWorkInProgress getOrganisationWorkInProgress(UUID randomUuid) {
        return workInProgressRepository.findByRandomUniqueId(randomUuid)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "OrganisationWorkInProgress", randomUuid)));
    }

    public Optional<OrganisationWorkInProgress> findById(Long id) {
        return workInProgressRepository.findById(id);
    }

    public OrganisationWorkInProgress save(OrganisationWorkInProgress entity) {
        return workInProgressRepository.save(entity);
    }

    public void deleteById(Long id) {
        workInProgressRepository.deleteById(id);
    }

    @Transactional
    public void handleSubmitForApproval(OrganisationWorkInProgress workInProgress, String userKeycloakId) {
        log.info("SubmitForApproval for OrganisationWorkInProgress [{}] with id [{}] and status [{}]",
                "OrganisationWorkInProgress",
                workInProgress.getRandomUniqueId(), workInProgress.getStatus());
        final Optional<DuplicateList> duplicateList;
        if (workInProgress.getStatus() != OrganisationStatus.AKTUALISIERUNG_ORGANISATION) {
            duplicateList = Optional.of(duplicateCheckService.checkForDuplicate(workInProgress));
            workInProgress.setStatus(OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
        } else {
            duplicateList = Optional.empty();
        }

        final OrganisationWorkInProgress savedOrganisationWorkInProgress = save(workInProgress);

        final UserResource userResource = keycloakService.getUserResource(userKeycloakId);
        if (Objects.isNull(userResource)) {
            throw new EntityNotFoundException(
                    String.format("Could not find [User] with id [%s]", userKeycloakId));
        }

        final UserRepresentation user = userResource.toRepresentation();
        if (Objects.isNull(user)) {
            throw new EntityNotFoundException(
                    String.format("Could not find [User] with username [%s]", userKeycloakId));
        }

        contactInviteService.handleContactInvite(savedOrganisationWorkInProgress, user);

        /*
         * Für Unternehmen welche nicht über die Startseite angelegt wurden oder und welche keine gefundenen Duplikate haben,
         * wird der Clearingprozess übersprungen (WPGWN-130)
         */
        if (skipClearingForOrganisation(workInProgress, duplicateList)) {
            try {
                organisationWorkInProgressPublishService.publishOrganisationWorkInProgress(workInProgress);
            } catch (ValidationException validationException) {
                log.error(
                        "SubmitForApproval for OrganisationWorkInProgress [{}] with id [{}] failed due to Validation Exception",
                        "OrganisationWorkInProgress", workInProgress.getRandomUniqueId(), validationException);
            }
        }
    }

    private boolean skipClearingForOrganisation(OrganisationWorkInProgress workInProgress,
                                                Optional<DuplicateList> duplicateList) {
        if (workInProgress.getStatus() == OrganisationStatus.AKTUALISIERUNG_ORGANISATION) {
            return true;
        }

        if (Objects.isNull(workInProgress.getSource())) {
            return false;
        }
        return SOURCES_WITHOUT_CLEARING.contains(workInProgress.getSource()) && !hasDuplicates(duplicateList);
    }

    private boolean hasDuplicates(Optional<DuplicateList> duplicateList) {
        return !duplicateList.map(DuplicateList::getDuplicateListItems).map(Set::isEmpty).orElse(true);
    }

    @Transactional
    public void deleteAllForOrganisation(Organisation organisation) {
        List<OrganisationWorkInProgress> wip = workInProgressRepository.findAllByOrganisation(organisation);
        wip.forEach(this::deleteOrganisationWorkInProgress);
        workInProgressRepository.deleteAll(wip);
    }

    @Transactional
    public void deleteOrganisationWorkInProgress(OrganisationWorkInProgress orgWip) {
        duplicateCheckService.deleteDuplicateListForOrganisationWip(orgWip);
        duplicateCheckService.removeFromDuplicateLists(orgWip);
        activityWorkInProgressService.deleteAllForOrganisationWorkInProgress(orgWip);

        // If OrgWIP got no Organisation --> is new Organisation --> remove keycloakGroup
        if (Objects.isNull(orgWip.getOrganisation())) {
            keycloakService.deleteOrganisationGroup(orgWip.getKeycloakGroupId());
        }
        try {
            deleteOrganisationLogo(orgWip);
            deleteOrganisationImage(orgWip);
            deleteOrganisationContactImageLogo(orgWip);
        } catch (IOException e) {
            log.warn("Unexpected error deleting images", e);
        }

        workInProgressRepository.delete(orgWip);
    }

    public String getContactImageOfReferencedOrganisation(OrganisationWorkInProgress workInProgress) {
        return Optional.of(workInProgress)
                .map(OrganisationWorkInProgress::getOrganisation)
                .map(Organisation::getContact)
                .map(Contact::getImage).orElse(null);
    }
}
