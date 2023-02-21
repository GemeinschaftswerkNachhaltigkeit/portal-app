package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.landing_page;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.Setter;

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
