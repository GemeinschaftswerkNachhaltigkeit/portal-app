package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.landing_page;

import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@ConfigurationProperties("landing-page.email")
@Getter
@Setter
@Validated
public class LandingPageEmailProperties {

    @NotEmpty
    @Valid
    private Set<@Email String> recipients = new HashSet<>();

    @NotNull
    @Valid
    private Set<@Email String> ccs = new HashSet<>();

    @NotNull
    @Valid
    private Set<@Email String> bccs = new HashSet<>();


}
