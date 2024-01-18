package com.exxeta.wpgwn.wpgwnapp.configuration.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import jakarta.validation.constraints.NotBlank;


@ConfigurationProperties("management.endpoints.security")
@Getter
@Validated
@RequiredArgsConstructor
public class ActuatorSecurityProperties {

    @NotBlank
    private final String username;

    @NotBlank
    private final String password;
}
