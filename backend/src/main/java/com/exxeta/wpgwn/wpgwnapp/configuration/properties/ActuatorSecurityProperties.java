package com.exxeta.wpgwn.wpgwnapp.configuration.properties;

import javax.validation.constraints.NotBlank;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.RequiredArgsConstructor;


@ConfigurationProperties("management.endpoints.security")
@Getter
@Validated
@ConstructorBinding
@RequiredArgsConstructor
public class ActuatorSecurityProperties {

    @NotBlank
    private final String username;

    @NotBlank
    private final String password;
}
