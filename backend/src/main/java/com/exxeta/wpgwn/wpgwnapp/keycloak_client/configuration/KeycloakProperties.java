package com.exxeta.wpgwn.wpgwnapp.keycloak_client.configuration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Duration;
import java.time.temporal.ChronoUnit;

import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "keycloak.admin")
@Getter
@Setter
@Validated
public class KeycloakProperties {

    @URL
    @NotNull
    private String serverUrl;

    @NotBlank
    private String adminRealm;

    @NotBlank
    private String clientId;

    @NotBlank
    private String clientSecret;

    @NotBlank
    private String adminUser;

    @NotBlank
    private String adminPassword;

    @NotBlank
    private String realm;

    private String proxyHost;

    private Integer proxyPort;

    @Positive
    private Integer connectionPoolSize;

    @NotNull
    @DurationUnit(ChronoUnit.SECONDS)
    private Duration readTimeout;

    @NotNull
    @DurationUnit(ChronoUnit.SECONDS)
    private Duration connectionTimeout;

    @NotBlank
    private String organisationGroupId;

    @NotBlank
    private String newlySignUpUsers;

}
