package com.exxeta.wpgwn.wpgwnapp.contact_form;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ContactFormDto {

    private String name;

    private String email;

    @NotBlank
    private String message;

    @AssertTrue
    @NotNull
    private Boolean privacyConsent;

    @NotNull
    private ContactType contactType;

}
