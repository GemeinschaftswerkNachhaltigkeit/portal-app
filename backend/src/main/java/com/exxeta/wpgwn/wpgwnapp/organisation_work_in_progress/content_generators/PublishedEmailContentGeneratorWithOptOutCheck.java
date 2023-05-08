package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators;

import java.util.Locale;
import java.util.Optional;

import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.context.MessageSource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email.ContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;

@Component
@RequiredArgsConstructor
public class PublishedEmailContentGeneratorWithOptOutCheck
        implements ContentGenerator<Organisation> {

    private final WpgwnProperties wpgwnProperties;

    private final MailToLinkGenerator mailToLinkGenerator;

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    private final KeycloakService keycloakService;

    @Override
    public String generateMailBody(Organisation entity) {
        final Context context = new Context(Locale.getDefault());

        context.setVariable("organisation", entity);
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        context.setVariable("invitationMailToLink", mailToLinkGenerator.buildMailToLink());
        return templateEngine.process("email/organisation-work-in-progress/publish/organisation-published",
                context);
    }

    @Override
    public String getSubject() {
        return emailMessageSource.getMessage("organisation-work-in-progress-publish-email.subject",
                new Object[0], Locale.getDefault());
    }

    @Override
    public String getTo(Organisation entity) {
        return Optional.of(entity)
                .map(Organisation::getKeycloakGroupId)
                .filter(StringUtils::hasText)
                .map(keycloakService::getAdminsGroupId)
                .map(keycloakService::getGroup)
                .map(GroupResource::members)
                .filter(member -> !member.isEmpty())
                .flatMap(member -> member.stream().map(UserRepresentation::getEmail).findFirst())
                .orElse(entity.getContact().getEmail());
    }

    @NonNull
    @Override
    public EmailOptOutOption getEmailOptOutOption() {
        return EmailOptOutOption.COMPANY_PUBLISHED;
    }

}
