package com.exxeta.wpgwn.wpgwnapp.action_page.validation;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.ActionPageForm;

public interface ActionPageFromValidator<T extends ActionPageForm> {

    void validate(T t);
}
