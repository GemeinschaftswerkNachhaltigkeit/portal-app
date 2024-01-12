package com.exxeta.wpgwn.wpgwnapp.action_page.dto;

import com.exxeta.wpgwn.wpgwnapp.action_page.shared.ActionPageRequest;
import com.exxeta.wpgwn.wpgwnapp.action_page.shared.FormKey;

import com.exxeta.wpgwn.wpgwnapp.action_page.validation.JsonString;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class ActionFromRequestDto implements ActionPageRequest {

    @JsonProperty("payload")
    @NotBlank
    @JsonString
    private String payload;

    @JsonProperty("formKey")
    @NotNull
    private FormKey formKey;

    @JsonProperty("userLanguage")
    private UserLanguage userLanguage = UserLanguage.DE;


}
