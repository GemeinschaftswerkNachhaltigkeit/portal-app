package com.exxeta.wpgwn.wpgwnapp.action_page.email;

import com.exxeta.wpgwn.wpgwnapp.action_page.configuration.ActionPageEmailProperties;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.DefaultFormDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;

import java.util.Set;

@Component
public class ActionPageDefaultAdminEmailGenerator extends AbstractActionPageEmailGenerator {


    public ActionPageDefaultAdminEmailGenerator(TemplateEngine templateEngine, MessageSource emailMessageSource,
                                                WpgwnProperties wpgwnProperties,
                                                ActionPageEmailProperties actionPageEmailProperties) {
        super(templateEngine, emailMessageSource, wpgwnProperties, actionPageEmailProperties);
    }

    @Override
    public String getSubject(DefaultFormDto entity, ActionPageEmailType emailType, UserLanguage userLanguage) {
        return getEmailMessageSource().getMessage(emailType.getSubjectKey(), new Object[0], userLocale(userLanguage));
    }

    @Override
    public Set<String> getTo(DefaultFormDto entity, ActionPageEmailType emailType) {
        return getRecipients(emailType);
    }


}
