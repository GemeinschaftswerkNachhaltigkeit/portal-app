package com.exxeta.wpgwn.wpgwnapp.action_page.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.email.ActionPageDefaultUserEmailGenerator;
import com.exxeta.wpgwn.wpgwnapp.action_page.email.ActionPageEmailGenerator;

@RequiredArgsConstructor
public enum ActionPageEmailType {

    BIODIVERSITY_USER(
            "biodiversity.email.user.subject",
            "email/action-page/biodiversity/email-to-user",
            ActionPageDefaultUserEmailGenerator.class),

    BIODIVERSITY_ADMIN(
            "biodiversity.email.admin.subject",
            "email/action-page/biodiversity/email-to-admin",
            ActionPageDefaultUserEmailGenerator.class);

    @Getter
    private final String subjectKey;
    @Getter
    private final String template;

    @Getter
    private final Class<? extends ActionPageEmailGenerator> emailGenerator;
}
