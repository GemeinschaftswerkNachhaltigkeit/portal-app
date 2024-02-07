package com.exxeta.wpgwn.wpgwnapp.contact_form;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
