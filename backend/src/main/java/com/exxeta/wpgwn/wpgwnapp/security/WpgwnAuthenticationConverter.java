package com.exxeta.wpgwn.wpgwnapp.security;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken.TokenType;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WpgwnAuthenticationConverter {

    private static final String ROLE_PREFIX = "ROLE_";

    public Converter<Jwt, BearerTokenAuthentication> wpgwnTokenConverter() {
        return source -> {
            Collection<GrantedAuthority> authorities = extractAuthorities(source);
            OAuth2AuthenticatedPrincipal oauthPrincipal =
                    new DefaultOAuth2AuthenticatedPrincipal(source.getClaims(), authorities);
            OAuth2AccessToken credentials =
                    new OAuth2AccessToken(TokenType.BEARER, source.getTokenValue(), source.getIssuedAt(),
                            source.getExpiresAt());

            return new BearerTokenAuthentication(oauthPrincipal, credentials, authorities);
        };
    }

    private Set<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Collection<String> groups = extractRoles(jwt.getClaims());
        Set<GrantedAuthority> result = groups.stream()
                .map(this::addRolePrefix)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toUnmodifiableSet());

        log.debug("Converted roles from {} to {}", groups, result);
        return result;
    }

    private String addRolePrefix(@NonNull String auth) {
        if (auth.startsWith(ROLE_PREFIX)) {
            return auth;
        } else {
            return ROLE_PREFIX + auth;
        }
    }

    private Collection<String> extractRoles(Map<String, Object> claims) {
        final String[] path = {"resource_access", "wpgwn-app"};

        Map<String, Object> data = claims;
        for (String segment : path) {
            if (Objects.nonNull(data)) {
                data = (Map<String, Object>) data.get(segment);
            }
        }

        if (Objects.isNull(data)) {
            return Collections.emptyList();
        } else {
            return (Collection<String>) data.get("roles");
        }
    }

}
