package com.exxeta.wpgwn.wpgwnapp.ui_properties;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "ui-config")
@Getter
@Setter
@Validated
public class UiConfigProperties {

    @NotNull
    private Boolean production;

    @NotBlank
    private String apiUrl;

    @NotBlank
    private String apiV2Url;

    private String contextPath = "";

    @NotBlank
    private String directusBaseUrl;

    @NotBlank
    private String landingPageUrl;

    @NotBlank
    private String matomoUrl;

    @Positive
    @NotNull
    private Integer matomoSiteId;

    @NotNull
    @Valid
    private KeycloakProperties keycloak;

    @Getter
    @Setter
    @Validated
    public static class KeycloakProperties {

        @NotBlank
        @URL
        private String issuer;

        @NotBlank
        private String clientId;

        private boolean debug = false;
    }

}
