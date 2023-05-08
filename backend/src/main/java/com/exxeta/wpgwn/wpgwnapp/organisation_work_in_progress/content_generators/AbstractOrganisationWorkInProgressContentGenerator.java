package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators;

import javax.validation.constraints.NotBlank;
import java.util.Locale;
import java.util.Optional;

import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.context.MessageSource;
import org.springframework.util.StringUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email.ContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;

/**
 * Abstrakte Klasse für E-Mail Versand für Organisation Wip relevante E-Mails.
 */
@RequiredArgsConstructor
public abstract class AbstractOrganisationWorkInProgressContentGenerator implements
        ContentGenerator<OrganisationWorkInProgress> {

    private final WpgwnProperties wpgwnProperties;

    private final MailToLinkGenerator mailToLinkGenerator;

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    private final KeycloakService keycloakService;

    private final EmailOptOutService emailOptOutService;

    @NotBlank
    private final String subjectResourceName;

    @NotBlank
    private final String templateName;

    @Override
    public String generateMailBody(OrganisationWorkInProgress entity) {
        final Context context = new Context(Locale.getDefault());

        context.setVariable("organisationWorkInProgress", entity);
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        context.setVariable("privacyContentUrl", wpgwnProperties.getPrivacyContentUrl());
        context.setVariable("invitationMailToLink", mailToLinkGenerator.buildMailToLink());
        context.setVariable("unsubscribeLink", emailOptOutService.getOptOutLink(getTo(entity)));
        return templateEngine.process(templateName, context);
    }

    @Override
    public String getSubject() {
        return emailMessageSource.getMessage(subjectResourceName, new Object[0], Locale.getDefault());
    }

    @Override
    public String getTo(OrganisationWorkInProgress entity) {
        return Optional.of(entity)
                .map(OrganisationWorkInProgress::getKeycloakGroupId)
                .filter(StringUtils::hasText)
                .map(keycloakService::getAdminsGroupId)
                .map(keycloakService::getGroup)
                .map(GroupResource::members)
                .filter(member -> !member.isEmpty())
                .flatMap(member -> member.stream().map(UserRepresentation::getEmail).findFirst())
                .orElse(entity.getContactWorkInProgress().getEmail());
    }

}
