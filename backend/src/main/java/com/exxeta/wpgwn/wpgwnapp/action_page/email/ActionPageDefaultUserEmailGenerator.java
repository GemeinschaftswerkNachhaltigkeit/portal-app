package com.exxeta.wpgwn.wpgwnapp.action_page.email;

import java.util.Set;

import com.exxeta.wpgwn.wpgwnapp.action_page.configuration.ActionPageEmailProperties;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.DefaultFormDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

@Component
public class ActionPageDefaultUserEmailGenerator extends AbstractActionPageEmailGenerator {

    public ActionPageDefaultUserEmailGenerator(TemplateEngine templateEngine, MessageSource emailMessageSource,
                                               WpgwnProperties wpgwnProperties,
                                               ActionPageEmailProperties actionPageEmailProperties) {
        super(templateEngine, emailMessageSource, wpgwnProperties, actionPageEmailProperties);
    }

    @Override
    public String getSubject(DefaultFormDto entity, ActionPageEmailType emailType, UserLanguage userLanguage) {
        return getEmailMessageSource().getMessage(emailType.getSubjectKey(),
                new Object[] {entity.getEmail()}, userLocale(userLanguage));
    }

    @Override
    public Set<String> getTo(DefaultFormDto entity, ActionPageEmailType emailType) {
        return Set.of(entity.getEmail());
    }

}
