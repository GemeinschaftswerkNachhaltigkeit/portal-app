package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import java.time.Clock;
import java.time.Instant;

import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;

import static com.exxeta.wpgwn.wpgwnapp.utils.ProfileService.PROD_PROFILE;

/**
 * Automatische Aktivitäten, die nur im Profile Prod aktiviert werden.
 */
@Profile(PROD_PROFILE)
@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledActivities {

    private final OrganisationWorkInProgressService organisationWorkInProgressService;

    private final WpgwnProperties wpgwnProperties;

    private final Clock clock;

    /**
     * Sendet E-Mails für alle angelegten organisationen im Status [PRIVACY_CONSENT_REQUIRED],
     * die in der letzten Woche keine E-Mail erhalten haben bis zur maximalen Anzahl von E-Mails.
     */
    @Scheduled(cron = "${wpgwn.organisation.import-privacy-consent-email.cron}")
    @Transactional
    void sendPrivacyEmails() {
        final Page<OrganisationWorkInProgress> result =
                getOrganisationWorkInProgressForNotification(OrganisationStatus.PRIVACY_CONSENT_REQUIRED);
        result
                .map(EntityBase::getId)
                .forEach(orgId -> {
                    try {
                        organisationWorkInProgressService.sendPrivacyConsentEmail(orgId);
                    } catch (Exception e) {
                        log.error("Error sending privacy consent email to organisation work in progress with id [{}]",
                                orgId, e);
                    }
                });
    }

    /**
     * Sendet Reminder E-Mails für alle angelegten organisationen im Status [NEU],
     * die in der letzten Woche keine E-Mail erhalten haben bis zur maximalen Anzahl von E-Mails.
     */
    @Scheduled(cron = "${wpgwn.organisation.reminder-email.cron}")
    @Transactional
    void sendReminderEmails() {
        final Page<OrganisationWorkInProgress> result =
                getOrganisationWorkInProgressForNotification(OrganisationStatus.NEW);
        result
                .map(EntityBase::getId)
                .forEach(orgId -> {
                    try {
                        organisationWorkInProgressService.sendReminderEmail(orgId);
                    } catch (Exception e) {
                        log.error("Error sending reminder email to organisation work in progress with id [{}]", orgId,
                                e);
                    }
                });
    }

    private Page<OrganisationWorkInProgress> getOrganisationWorkInProgressForNotification(OrganisationStatus status) {
        final BooleanExpression statusExpression = getStatsEqExpression(status);
        final BooleanExpression lastEMailBeforeExpression = getLastEMailBeforeExpression();
        final BooleanExpression numberEmailBelowMax = getNumEmailsBelowExpression();
        final BooleanExpression emailNotificationDatesEmpty =
                QOrganisationWorkInProgress.organisationWorkInProgress.emailNotificationDates.isEmpty();

        final BooleanExpression predicate = statusExpression
                .and(emailNotificationDatesEmpty.or(lastEMailBeforeExpression.and(numberEmailBelowMax)));
        final Pageable pageable = Pageable.ofSize(wpgwnProperties.getReminderEmail().getBatchSize());
        return organisationWorkInProgressService.findAllByPredicate(predicate, pageable);
    }


    private BooleanExpression getStatsEqExpression(OrganisationStatus status) {
        return QOrganisationWorkInProgress.organisationWorkInProgress.status
                .eq(status);
    }

    private BooleanExpression getNumEmailsBelowExpression() {
        return JPAExpressions
                .select(QOrganisationWorkInProgress.organisationWorkInProgress.emailNotificationDates.any().count())
                .lt((long) wpgwnProperties.getReminderEmail().getMaxReminders());
    }

    private BooleanExpression getLastEMailBeforeExpression() {
        return JPAExpressions
                .select(QOrganisationWorkInProgress.organisationWorkInProgress.emailNotificationDates.any().max())
                .lt(Instant.now(clock).minus(wpgwnProperties.getReminderEmail().getDurationBetweenReminders()));
    }
}
