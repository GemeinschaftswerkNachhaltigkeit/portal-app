package com.exxeta.wpgwn.wpgwnapp.action_page.dto.request;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;

public interface ActionPageRequest {

    FormKey getFormKey();

    String getUniqueHash();
}
