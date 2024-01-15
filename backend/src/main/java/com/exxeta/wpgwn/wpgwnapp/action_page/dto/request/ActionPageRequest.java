package com.exxeta.wpgwn.wpgwnapp.action_page.dto.request;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

public interface ActionPageRequest {

    String getPayload();

    FormKey getFormKey();

    String getUniqueHash();

    UserLanguage getUserLanguage();
}
