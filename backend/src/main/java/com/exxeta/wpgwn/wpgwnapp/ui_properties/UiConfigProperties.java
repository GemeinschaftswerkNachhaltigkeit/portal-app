package com.exxeta.wpgwn.wpgwnapp.ui_properties;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

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
