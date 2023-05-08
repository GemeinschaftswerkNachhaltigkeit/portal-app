package com.exxeta.wpgwn.wpgwnapp.organisation_membership.content_generator;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email.ContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipEmailDto;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;

@Component
@RequiredArgsConstructor
public class OrganisationMembershipNewUserEmailContentGenerator
        implements ContentGenerator<OrganisationMembershipEmailDto> {

    private final WpgwnProperties wpgwnProperties;

    private final MailToLinkGenerator mailToLinkGenerator;

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    @Override
    public String generateMailBody(OrganisationMembershipEmailDto dto) {
        final Context context = new Context(Locale.getDefault());

        context.setVariable("organisationMembership", dto.getOrganisationMembership());
        context.setVariable("organisation", dto.getOrganisationMembership().getOrganisation());
        context.setVariable("adminFirstName", dto.getAdminFirstName());
        context.setVariable("adminLastName", dto.getAdminLastName());
        context.setVariable("oneTimePassword", dto.getOneTimePassword());
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        context.setVariable("invitationMailToLink", mailToLinkGenerator.buildMailToLink());
        return templateEngine.process("email/organisation/organisation-membership/organisation-membership-new-user",
                context);
    }

    @Override
    public String getSubject() {
        return emailMessageSource.getMessage("organisation-membership-invite-new-user.subject",
                new Object[0], Locale.getDefault());
    }

    @Override
    public String getTo(OrganisationMembershipEmailDto dto) {
        return dto.getOrganisationMembership().getEmail();
    }

    @NonNull
    @Override
    public EmailOptOutOption getEmailOptOutOption() {
        return EmailOptOutOption.COMPANY_INVITE;
    }

}
