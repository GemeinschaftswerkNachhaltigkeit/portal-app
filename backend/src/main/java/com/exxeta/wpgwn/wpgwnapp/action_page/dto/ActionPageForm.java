package com.exxeta.wpgwn.wpgwnapp.action_page.dto;

import com.exxeta.wpgwn.wpgwnapp.action_page.shared.FormKey;

public interface ActionPageForm {
    FormKey formKey();

    String getUniqueHash();
}
