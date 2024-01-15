package com.exxeta.wpgwn.wpgwnapp.action_page.email;

import java.util.Locale;
import java.util.Optional;
import java.util.Set;

import org.springframework.context.MessageSource;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.configuration.ActionPageEmailProperties;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.DefaultFormDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

@RequiredArgsConstructor
public abstract class AbstractActionPageEmailGenerator implements ActionPageEmailGenerator<DefaultFormDto> {
    @Getter
    private final TemplateEngine templateEngine;
    @Getter
    private final MessageSource emailMessageSource;
    @Getter
    private final WpgwnProperties wpgwnProperties;
    @Getter
    private final ActionPageEmailProperties actionPageEmailProperties;

    @Override
    public String generateMailBody(DefaultFormDto entity, ActionPageEmailType emailType, UserLanguage userLanguage) {
        final Context context = new Context(userLocale(userLanguage));
        context.setVariable("contact", entity);
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        return templateEngine.process(emailType.getTemplate(), context);
    }

    protected Set<String> getRecipients(ActionPageEmailType emailType) {
        return Optional.ofNullable(actionPageEmailProperties.getRecipients())
                .map(recipients -> recipients.getOrDefault(emailType, actionPageEmailProperties.getDefaultRecipients()))
                .orElse(actionPageEmailProperties.getDefaultRecipients());
    }

    protected Locale userLocale(UserLanguage userLanguage) {
        return Locale.forLanguageTag(userLanguage.name().toLowerCase());
    }

}
