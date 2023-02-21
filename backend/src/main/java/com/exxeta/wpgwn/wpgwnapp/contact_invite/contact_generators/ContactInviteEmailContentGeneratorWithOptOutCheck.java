package com.exxeta.wpgwn.wpgwnapp.contact_invite.contact_generators;

import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

import org.springframework.context.MessageSource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInvite;
import com.exxeta.wpgwn.wpgwnapp.email.ContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutOption;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;

@Component
@RequiredArgsConstructor
public class ContactInviteEmailContentGeneratorWithOptOutCheck implements ContentGenerator<ContactInvite> {

    private final WpgwnProperties wpgwnProperties;

    private final MailToLinkGenerator mailToLinkGenerator;

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    private final OrganisationMapper organisationMapper;

    @Override
    public String generateMailBody(ContactInvite entity) {
        final Context context = new Context(Locale.getDefault());
        Organisation organisation = entity.getOrganisation();
        if (Objects.isNull(entity.getOrganisation())) {
            organisation = new Organisation();
            organisationMapper.mapWorkInProgressToOrganisationWithoutActivities(entity.getOrganisationWorkInProgress(),
                    organisation);
        }

        context.setVariable("contactInvite", entity);
        context.setVariable("organisation", organisation);
        final Contact contact = Optional.ofNullable(entity.getActivity())
                .map(Activity::getContact)
                .orElse(organisation.getContact());
        context.setVariable("contact", contact);
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        context.setVariable("invitationMailToLink", mailToLinkGenerator.buildMailToLink());
        return templateEngine.process("email/organisation-work-in-progress/contact_invite/organisation-contact-invite",
                context);
    }

    @Override
    public String getSubject() {
        return emailMessageSource.getMessage("organisation-contact-invite-email.subject",
                new Object[0], Locale.getDefault());
    }

    @Override
    public String getTo(ContactInvite entity) {
        return entity.getContact().getEmail();
    }

    @NonNull
    @Override
    public EmailOptOutOption getEmailOptOutOption() {
        return EmailOptOutOption.CONTACT_INVITE;
    }

}
