package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.landing_page;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LandingPageContentGenerator {

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    String generateMailBody(LandingPageOrganisationDto landingPageOrganisationDto) {
        final Context context = new Context(Locale.getDefault());

        context.setVariable("signupForm", landingPageOrganisationDto);
        return templateEngine.process("email/landing-page/landing-page-signup-email", context);
    }

    String getSubject() {
        return emailMessageSource.getMessage("landing-page-signup-email.subject", new Object[0], Locale.getDefault());
    }

}
