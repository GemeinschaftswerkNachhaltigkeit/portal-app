package com.exxeta.wpgwn.wpgwnapp.action_page.dto;

import com.exxeta.wpgwn.wpgwnapp.action_page.shared.FormKey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.apache.commons.codec.digest.DigestUtils;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DefaultFormDto extends AbstractActionFormDto {

    @Override
    public FormKey formKey() {
        return FormKey.DEFAULT;
    }

    @Override
    public String getUniqueHash() {
        return "";
    }
}
