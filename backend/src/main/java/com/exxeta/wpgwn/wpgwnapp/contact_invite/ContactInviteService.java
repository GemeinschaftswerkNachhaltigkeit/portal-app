package com.exxeta.wpgwn.wpgwnapp.contact_invite;


import javax.persistence.EntityNotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.contact_generators.ContactInviteDeniedEmailContentGeneratorWithOptOutCheck;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.contact_generators.ContactInviteEmailContentGeneratorWithOptOutCheck;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.exception.EntityExpiredException;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactInviteService {

    private final ContactInviteRepository contactInviteRepository;
    private final OrganisationRepository organisationRepository;
    private final OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    private final ActivityRepository activityRepository;
    private final SharedMapper sharedMapper;
    private final WpgwnProperties wpgwnProperties;
    private final EmailService emailService;
    private final ContactInviteEmailContentGeneratorWithOptOutCheck contactInviteEmailContentGenerator;
    private final ContactInviteDeniedEmailContentGeneratorWithOptOutCheck contactInviteDeniedEmailContentGenerator;
    private final Clock clock;

    private ContactInvite createNewContactInviteAndSendMail(OrganisationWorkInProgress organisationWorkInProgress,
                                                            ContactWorkInProgress newContact) {
        ContactInvite contactInvite = createNewContactInvite(organisationWorkInProgress, null,
                sharedMapper.mapContactWipToContact(newContact),
                Instant.now(clock).plus(wpgwnProperties.getContactInvite().getExpireFromCreationInDays()));

        emailService.sendMail(contactInviteEmailContentGenerator, contactInvite);
        contactInvite.setEmailSent(true);

        return contactInviteRepository.save(contactInvite);
    }

    private ContactInvite createNewContactInviteAndSendMail(Activity activity,
                                                            Contact newContact) {
        ContactInvite contactInvite = createNewContactInvite(null, activity, newContact,
                Instant.now(clock).plus(wpgwnProperties.getContactInvite().getExpireFromCreationInDays()));

        emailService.sendMail(contactInviteEmailContentGenerator, contactInvite);
        contactInvite.setEmailSent(true);

        return contactInviteRepository.save(contactInvite);
    }

    private ContactInvite createNewContactInvite(@Nullable OrganisationWorkInProgress organisationWorkInProgress,
                                                 @Nullable Activity activity,
                                                 Contact newContact, Instant expiresAt) {

        ContactInvite contactInvite = new ContactInvite();
        contactInvite.setRandomUniqueId(UUID.randomUUID());
        contactInvite.setRandomIdGenerationTime(Instant.now(clock));
        contactInvite.setStatus(ContactInviteStatus.OPEN);
        if (Objects.nonNull(organisationWorkInProgress)) {
            contactInvite.setOrganisationWorkInProgress(organisationWorkInProgress);
        } else if (Objects.nonNull(activity)) {
            contactInvite.setActivity(activity);
            contactInvite.setOrganisation(activity.getOrganisation());
        }
        contactInvite.setContact(newContact);
        contactInvite.setExpiresAt(expiresAt);
        contactInvite.setEmailSent(false);

        return contactInviteRepository.save(contactInvite);
    }

    @Transactional
    public ContactInvite getContactInvite(UUID uuid) throws EntityExpiredException {
        return getContactInvite(uuid, true);
    }

    @Transactional
    public ContactInvite getContactInvite(UUID uuid, Boolean failOnExpire) throws EntityExpiredException {
        ContactInvite result = contactInviteRepository
                .findByRandomUniqueId(uuid)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "ContactInvite", uuid)));
        if (failOnExpire) {
            checkExpire(result);
        }
        return result;
    }

    public List<ContactInvite> getContactInvite(OrganisationWorkInProgress organisationWorkInProgress) {
        return contactInviteRepository.findAllByOrganisationWorkInProgressAndStatus(organisationWorkInProgress,
                ContactInviteStatus.OPEN);
    }

    @Transactional
    public ContactInvite changeContactInviteStatusTo(UUID uuid, ContactInviteStatus newStatus)
            throws EntityExpiredException {
        return changeContactInviteStatusTo(uuid, newStatus, true);
    }

    private ContactInvite changeContactInviteStatusTo(UUID uuid, ContactInviteStatus newStatus, Boolean failOnExpire)
            throws EntityExpiredException {
        final ContactInvite contactInvite = getContactInvite(uuid, failOnExpire);

        contactInvite.setStatus(newStatus);
        if (!ContactInviteStatus.OPEN.equals(newStatus)) {
            contactInvite.setClosedAt(Instant.now(clock));
        }

        if (ContactInviteStatus.ALLOW.equals(newStatus)) {
            updateOrganisationWithContactInvite(contactInvite);
        }

        if (ContactInviteStatus.DENY.equals(newStatus)) {
            emailService.sendMail(contactInviteDeniedEmailContentGenerator, contactInvite);
        }

        return contactInviteRepository.save(contactInvite);
    }

    private void updateOrganisationWithContactInvite(ContactInvite contactInvite) {
        final Activity activity = contactInvite.getActivity();
        final Organisation organisation = contactInvite.getOrganisation();
        final OrganisationWorkInProgress organisationWorkInProgress = contactInvite.getOrganisationWorkInProgress();
        if (Objects.nonNull(activity)) {
            activity.setContact(contactInvite.getContact());
            activityRepository.save(activity);
        } else if (Objects.nonNull(organisation)) {
            organisation.setContact(contactInvite.getContact());
            organisationRepository.save(organisation);
        }
        if (Objects.nonNull(organisationWorkInProgress)) {
            organisationWorkInProgress.setContactWorkInProgress(
                    sharedMapper.mapContactToContactWip(contactInvite.getContact()));
            organisationWorkInProgressRepository.save(organisationWorkInProgress);
        }
    }

    @Transactional
    public void updatePublishedOrganisation(OrganisationWorkInProgress workInProgress, Organisation savedOrganisation) {
        final List<ContactInvite> contactInvites = contactInviteRepository
                .findAllByOrganisationWorkInProgress(workInProgress);
        contactInvites.forEach(contactInvite -> {
            contactInvite.setOrganisationWorkInProgress(null);
            contactInvite.setOrganisation(savedOrganisation);
        });

        contactInviteRepository.saveAll(contactInvites);
    }

    private void checkExpire(ContactInvite contactInvite) throws EntityExpiredException {
        if (ContactInviteStatus.EXPIRED.equals(contactInvite.getStatus())
                || (Objects.nonNull(contactInvite.getExpiresAt())
                && contactInvite.getExpiresAt().isBefore(Instant.now(clock)))
        ) {
            throw new EntityExpiredException(
                    String.format("[%s] with uuid [%s] expired!", "ContactInvite", contactInvite.getRandomUniqueId()));
        }
    }

    private void expireOpenContactInvitations(OrganisationWorkInProgress workInProgress) {

        final List<ContactInvite> contactInvites = contactInviteRepository
                .findAllByOrganisationWorkInProgressAndStatus(workInProgress, ContactInviteStatus.OPEN);

        if (Objects.nonNull(workInProgress.getOrganisation())) {
            contactInvites.addAll(contactInviteRepository
                    .findAllByOrganisationAndStatus(workInProgress.getOrganisation(), ContactInviteStatus.OPEN));
        }

        contactInvites.forEach(contactInvite -> contactInvite.setStatus(ContactInviteStatus.EXPIRED));
        contactInviteRepository.saveAll(contactInvites);
    }

    private void expireOpenContactInvitations(Activity activity) {

        final List<ContactInvite> contactInvites = contactInviteRepository
                .findAllByActivityAndStatus(activity, ContactInviteStatus.OPEN);

        contactInvites.forEach(contactInvite -> contactInvite.setStatus(ContactInviteStatus.EXPIRED));
        contactInviteRepository.saveAll(contactInvites);
    }

    public void handleContactInvite(OrganisationWorkInProgress workInProgress, UserRepresentation user) {
        /**
         * Deaktivieren alter Einladungen
         */
        expireOpenContactInvitations(workInProgress);

        if (!contactIsUser(workInProgress.getContactWorkInProgress(), user)
                && !hasApprovedContactInviteForOrganisation(workInProgress)) {

            ContactWorkInProgress newContact = workInProgress.getContactWorkInProgress();

            /**
             * Kontakt vorerst durch verantwortlichen Nutzer ersetzen
             */
            ContactWorkInProgress contactByOwner = new ContactWorkInProgress();
            workInProgress.setContactWorkInProgress(contactByOwner);
            if (user != null) {
                contactByOwner.setFirstName(user.getFirstName());
                contactByOwner.setLastName(user.getLastName());
                contactByOwner.setEmail(user.getEmail());
            } else {
                log.info("user was null");
            }
            final OrganisationWorkInProgress savedWorkInProgress =
                    organisationWorkInProgressRepository.save(workInProgress);

            /**
             * Neue Kontakteinladung erstellen
             */
            createNewContactInviteAndSendMail(savedWorkInProgress, newContact);
        }
    }

    /**
     *  Kontakteinladung für Aktivitäten. Aktuell deaktiviert, sodass jede beliebige Kontaktperson ohne Zustimmung
     *  eingetragen werden kann.
     * <p>
     *  Wurde vom {@link com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressPublishService} aufgerufen.
     */
    public void handleContactInvite(Activity activity, UserRepresentation user) {
        /**
         * Deaktivieren alter Einladungen
         */
        expireOpenContactInvitations(activity);

        if (!contactIsUser(activity.getContact(), user)
                && !hasApprovedContactInviteForOrganisation(activity)) {

            final Contact newContact = activity.getContact();

            /**
             * Kontakt vorerst durch verantwortlichen Nutzer ersetzen
             */
            Contact contactByOwner = new Contact();
            activity.setContact(contactByOwner);
            if (user != null) {
                contactByOwner.setFirstName(user.getFirstName());
                contactByOwner.setLastName(user.getLastName());
                contactByOwner.setEmail(user.getEmail());
            } else {
                log.info("user was null");
            }
            final Activity savedActivity = activityRepository.save(activity);

            /**
             * Neue Kontakteinladung erstellen
             */
            createNewContactInviteAndSendMail(savedActivity, newContact);
        }
    }

    private boolean hasApprovedContactInviteForOrganisation(OrganisationWorkInProgress workInProgress) {
        return hasApprovedContactInvite(workInProgress);
    }

    private boolean hasApprovedContactInviteForOrganisation(Activity activity) {
        return hasApprovedContactInvite(activity.getOrganisation());
    }

    private boolean hasApprovedContactInvite(final OrganisationWorkInProgress organisationWorkInProgress) {
        if (Objects.isNull(organisationWorkInProgress)) {
            return false;
        }

        final Organisation organisation = organisationWorkInProgress.getOrganisation();
        final String email = organisationWorkInProgress.getContactWorkInProgress().getEmail();
        final Predicate predicateOrganisationWorkInProgress =
                QContactInvite.contactInvite.organisationWorkInProgress.eq(organisationWorkInProgress)
                        .and(QContactInvite.contactInvite.contact.email.containsIgnoreCase(email))
                        .and(QContactInvite.contactInvite.status.eq(ContactInviteStatus.ALLOW));

        final BooleanBuilder builder = new BooleanBuilder(predicateOrganisationWorkInProgress);

        if (Objects.nonNull(organisation)) {
            final Predicate predicateOrganisation = QContactInvite.contactInvite.organisation.eq(organisation)
                    .and(QContactInvite.contactInvite.contact.email.containsIgnoreCase(email))
                    .and(QContactInvite.contactInvite.status.eq(ContactInviteStatus.ALLOW));
            builder.or(predicateOrganisation);
        }

        return contactInviteRepository.exists(builder);
    }

    private boolean hasApprovedContactInvite(final Organisation organisation) {
        if (Objects.isNull(organisation)) {
            return false;
        }

        final String email = organisation.getContact().getEmail();
        final Predicate predicateOrganisation = QContactInvite.contactInvite.organisation.eq(organisation)
                .and(QContactInvite.contactInvite.contact.email.containsIgnoreCase(email))
                .and(QContactInvite.contactInvite.status.eq(ContactInviteStatus.ALLOW));

        return contactInviteRepository.exists(predicateOrganisation);
    }

    private boolean contactIsUser(ContactWorkInProgress contact, UserRepresentation user) {
        return Objects.nonNull(user)
                && Objects.equals(user.getEmail().toLowerCase(), contact.getEmail().toLowerCase());
    }

    private boolean contactIsUser(Contact contact, UserRepresentation user) {
        return Objects.nonNull(user)
                && Objects.equals(user.getEmail().toLowerCase(), contact.getEmail().toLowerCase());
    }

    @Transactional
    public void handleDeleteActivity(Activity activity) {

        List<ContactInvite> contactInvites = contactInviteRepository.findAllByActivity(activity);
        for (ContactInvite contactInvite : contactInvites) {
            if (contactInvite.getStatus() == ContactInviteStatus.ALLOW) {
                contactInvite.setActivity(null);
                contactInviteRepository.save(contactInvite);
                log.debug("preserve allowed contact invite [{}] for activity [{}] on organisation level.",
                        contactInvite.getId(),
                        activity.getId());
            } else {
                contactInviteRepository.delete(contactInvite);
                log.debug("delete contact invite [{}] for activity [{}].", contactInvite.getId(), activity.getId());
            }
        }
    }

    @Transactional
    public void deleteAllForOrganisation(Organisation organisation) {
        contactInviteRepository.deleteAllByOrganisation(organisation);
    }
}
