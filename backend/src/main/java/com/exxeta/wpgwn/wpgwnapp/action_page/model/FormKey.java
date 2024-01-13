package com.exxeta.wpgwn.wpgwnapp.action_page.model;

import com.exxeta.wpgwn.wpgwnapp.action_page.processor.ActionPageRequestProcessor;
import com.exxeta.wpgwn.wpgwnapp.action_page.processor.BiodiversityRequestProcessor;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum FormKey {

    @JsonProperty("biodiversity")
    BIODIVERSITY(BiodiversityRequestProcessor.class, ActionPageStatus.EMAIL_PENDING);

    @Getter
    private final Class<? extends ActionPageRequestProcessor> process;

    @Getter
    private final ActionPageStatus initStatus;
}
