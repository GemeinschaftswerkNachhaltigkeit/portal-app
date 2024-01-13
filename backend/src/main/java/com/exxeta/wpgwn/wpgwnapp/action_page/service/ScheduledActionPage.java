package com.exxeta.wpgwn.wpgwnapp.action_page.service;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.exxeta.wpgwn.wpgwnapp.utils.ProfileService.PROD_PROFILE;

/**
 * Automatische ActionPage Job, die nur im Profile Prod aktiviert werden.
 */
@Profile(PROD_PROFILE)
@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledActionPage {

    private final WpgwnProperties wpgwnProperties;


    /**
     * Sendet E-Mails für alle angelegten actionPage Form im Status [EMAIL_PENDING]
     */
    @Scheduled(cron = "${wpgwn.aciton-page.email-send.cron}")
    @Transactional
    public void sendActionPageEmails() {

    }

}
