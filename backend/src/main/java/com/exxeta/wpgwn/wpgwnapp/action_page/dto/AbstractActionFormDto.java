package com.exxeta.wpgwn.wpgwnapp.action_page.dto;

import com.exxeta.wpgwn.wpgwnapp.action_page.shared.FormKey;
import com.exxeta.wpgwn.wpgwnapp.action_page.shared.LanguageValue;

import lombok.Getter;
import lombok.Setter;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
@SuppressWarnings("MagicNumber")
public abstract class AbstractActionFormDto implements ActionPageForm{

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

    public abstract String getUniqueHash();

}
