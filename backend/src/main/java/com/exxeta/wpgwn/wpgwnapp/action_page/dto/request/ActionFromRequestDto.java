package com.exxeta.wpgwn.wpgwnapp.action_page.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.apache.commons.codec.digest.DigestUtils;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;
import com.exxeta.wpgwn.wpgwnapp.action_page.validation.JsonString;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

import com.fasterxml.jackson.annotation.JsonProperty;

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


    @Override
    public String getUniqueHash() {
        return DigestUtils.md5Hex(payload.toLowerCase() + "|" + formKey.name().toLowerCase());
    }
}
