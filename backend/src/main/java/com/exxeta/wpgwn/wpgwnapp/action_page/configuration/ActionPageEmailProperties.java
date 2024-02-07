package com.exxeta.wpgwn.wpgwnapp.action_page.configuration;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;

@ConfigurationProperties("action-page")
@Getter
@Setter
@Validated
public class ActionPageEmailProperties {

    @NotEmpty
    @NotNull
    @Valid
    private Set<@Email String> defaultRecipients;

    @Valid
    private Map<@NotNull ActionPageEmailType, @NotEmpty Set<@Email String>> recipients = new HashMap<>();

    @NotNull
    @Valid
    private Set<@Email String> ccs = new HashSet<>();

    @NotNull
    @Valid
    private Set<@Email String> bccs = new HashSet<>();

}
