package com.exxeta.wpgwn.wpgwnapp.contact_form;

import jakarta.validation.constraints.NotNull;
import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;

@Service
@RequiredArgsConstructor
public class ContactFormUserEmailContentGenerator {

    private final WpgwnProperties wpgwnProperties;

    private final MailToLinkGenerator mailToLinkGenerator;

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    String generateMailBody(ContactFormDto contactFormDto) {
        final Context context = new Context(Locale.getDefault());

        context.setVariable("contactForm", contactFormDto);
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        context.setVariable("invitationMailToLink", mailToLinkGenerator.buildMailToLink());
        return templateEngine.process("email/contact-form/contact-form-email-to-user", context);
    }

    String getSubject(@NotNull ContactType contactType) {
        return emailMessageSource.getMessage("contact-form.user.email.subject", new Object[] {contactType},
                Locale.getDefault());
    }

}
