package com.exxeta.wpgwn.wpgwnapp.action_page.dto.form;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

import org.hibernate.validator.constraints.Length;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.LanguageValue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@SuppressWarnings("MagicNumber")
public class DefaultFormDto implements ActionPageForm {

    @NotBlank
    @Length(max = 200)
    private String name;

    @Length(max = 200)
    private String organisation;

    @NotBlank
    @Email
    @Length(max = 200)
    private String email;

    @Length(max = 200)
    private String position;

    @AssertTrue
    @NotNull
    private Boolean privacyConsent;

    private Map<String, LanguageValue> attributes;
}
