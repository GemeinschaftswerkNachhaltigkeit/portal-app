package com.exxeta.wpgwn.wpgwnapp.ui_properties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UiConfigPropertiesDto {

    private Boolean production;

    private String apiUrl;

    private String contextPath;

    private String directusBaseUrl;

    private String landingPageUrl;

    private String matomoUrl;

    private Integer matomoSiteId;

    private UiConfigProperties.KeycloakProperties keycloak;

    @Getter
    @Setter
    public static class KeycloakProperties {

        private String issuer;

        private String clientId;

        private boolean debug;
    }

}
