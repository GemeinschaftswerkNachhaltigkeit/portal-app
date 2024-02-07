package com.exxeta.wpgwn.wpgwnapp.email;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties("email")
@Validated
@Getter
@Setter
public class EmailProperties {

    @NotBlank
    private String defaultFrom;

    @NotNull
    private String prefixForSubject = "";

}
