package com.exxeta.wpgwn.wpgwnapp.action_page.service.processor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.ActionPageForm;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;

public interface ActionPageRequestProcessor {

    void validate(ActionFromRequestDto actionFromRequestDto);

    void create(ActionFromRequestDto actionFromRequestDto);

    FormKey getFormKey();

    <T extends ActionPageForm> T getActionPageForm(ActionFromRequestDto actionFromRequestDto);

    void postConstruct(ActionFromRequestDto actionFromRequestDto);

    boolean isExist(ActionFromRequestDto actionFromRequestDto);

}
