package com.exxeta.wpgwn.wpgwnapp.action_page.shared;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.ActionPageForm;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.DefaultFormDto;

import com.exxeta.wpgwn.wpgwnapp.action_page.process.ActionPageRequestProcess;

import com.exxeta.wpgwn.wpgwnapp.action_page.process.DefaultActionRequestProcess;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum FormKey {

    @JsonProperty("default")
    DEFAULT(DefaultActionRequestProcess.class),

    @JsonProperty("biodiversity")
    BIODIVERSITY(DefaultActionRequestProcess.class);

    @Getter
    private final Class<? extends ActionPageRequestProcess> process;
}
