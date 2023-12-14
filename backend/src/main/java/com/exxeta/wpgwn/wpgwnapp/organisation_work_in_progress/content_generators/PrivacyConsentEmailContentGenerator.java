package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators;

import org.springframework.context.MessageSource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;

@Component
public class PrivacyConsentEmailContentGenerator
        extends AbstractOrganisationWorkInProgressContentGenerator {

    public PrivacyConsentEmailContentGenerator(WpgwnProperties wpgwnProperties,
                                               MailToLinkGenerator mailToLinkGenerator,
                                               TemplateEngine templateEngine,
                                               MessageSource emailMessageSource,
                                               KeycloakService keycloakService,
                                               EmailOptOutService emailOptOutService) {

        super(wpgwnProperties,
                mailToLinkGenerator,
                templateEngine,
                emailMessageSource,
                keycloakService,
                emailOptOutService,
                "organisation-work-in-progress-privacy-consent-email.subject",
                wpgwnProperties.getPrivacyContentEmailTemplate());
    }

    @NonNull
    @Override
    public EmailOptOutOption getEmailOptOutOption() {
        return EmailOptOutOption.COMPANY_WIP_CONSENT;
    }
}
