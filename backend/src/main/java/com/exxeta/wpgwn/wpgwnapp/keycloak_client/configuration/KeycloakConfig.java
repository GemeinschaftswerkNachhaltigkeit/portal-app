package com.exxeta.wpgwn.wpgwnapp.keycloak_client.configuration;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class KeycloakConfig {

    @Bean
    public Keycloak keycloak(KeycloakProperties keycloakProperties, ResteasyClient resteasyClient) {
        // User "idm-admin" needs at least "manage-users, view-clients, view-realm, view-users" roles for "realm-management"
        return KeycloakBuilder.builder()
                .resteasyClient(resteasyClient)
                .serverUrl(keycloakProperties.getServerUrl())
                .realm(keycloakProperties.getAdminRealm())
                .grantType(OAuth2Constants.PASSWORD)
                .clientId(keycloakProperties.getClientId())
                .clientSecret(keycloakProperties.getClientSecret())
                .username(keycloakProperties.getAdminUser())
                .password(keycloakProperties.getAdminPassword())
                .build();
    }

    @Bean
    public ResteasyClient resteasyClientWithProxy(KeycloakProperties keycloakProperties) {
        ResteasyClientBuilder builder = new ResteasyClientBuilder()
                .connectionPoolSize(keycloakProperties.getConnectionPoolSize())
                .connectTimeout(keycloakProperties.getConnectionTimeout().getSeconds(), TimeUnit.SECONDS)
                .readTimeout(keycloakProperties.getReadTimeout().getSeconds(), TimeUnit.SECONDS);
        if (StringUtils.hasText(keycloakProperties.getProxyHost())
                && Objects.nonNull(keycloakProperties.getProxyPort())) {
            builder.defaultProxy(keycloakProperties.getProxyHost(), keycloakProperties.getProxyPort());
        }
        return builder.build();
    }
}
