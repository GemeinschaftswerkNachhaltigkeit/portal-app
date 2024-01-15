package com.exxeta.wpgwn.wpgwnapp.action_page.email;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

import java.util.Set;

public interface ActionPageEmailGenerator<T> {

    String generateMailBody(T entity, ActionPageEmailType emailType, UserLanguage userLanguage);

    String getSubject(T entity, ActionPageEmailType emailType, UserLanguage userLanguage);

    Set<String> getTo(T entity, ActionPageEmailType emailType);

}
