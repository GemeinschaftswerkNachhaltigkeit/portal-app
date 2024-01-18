package com.exxeta.wpgwn.wpgwnapp.action_page.model;

import jakarta.validation.constraints.NotNull;
import java.util.Set;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.service.processor.ActionPageRequestProcessor;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.processor.BiodiversityRequestProcessor;

import com.fasterxml.jackson.annotation.JsonProperty;

import static com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType.BIODIVERSITY_ADMIN;
import static com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType.BIODIVERSITY_USER;

@RequiredArgsConstructor
public enum FormKey {

    @JsonProperty("biodiversity") BIODIVERSITY(BiodiversityRequestProcessor.class, PostConstructJob.EMAIL,
            Set.of(BIODIVERSITY_USER, BIODIVERSITY_ADMIN));

    @Getter
    private final Class<? extends ActionPageRequestProcessor> process;

    @Getter
    @NotNull
    private final PostConstructJob postConstructJob;

    @Getter
    private final Set<ActionPageEmailType> emailTypes;
}
