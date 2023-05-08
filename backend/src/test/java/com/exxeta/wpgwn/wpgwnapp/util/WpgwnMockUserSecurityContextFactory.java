package com.exxeta.wpgwn.wpgwnapp.util;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken.TokenType;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.WithMockWpgwnUser;

public class WpgwnMockUserSecurityContextFactory
        implements WithSecurityContextFactory<WithMockWpgwnUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockWpgwnUser mockUser) {
        final SecurityContext context = SecurityContextHolder.createEmptyContext();

        final Map<String, Object> claims = new HashMap<>(Map.of(
                "preferred_username", "testuser",
                "sub", mockUser.userId(),
                "name", "Tester",
                "email_verified", true,
                "email", "test@mockmvc.com"
        ));

        if ((mockUser.organisationId() > 0)) {
            claims.put(JwtTokenNames.ORGANISATION_ID, mockUser.organisationId());
        }

        if (mockUser.organisationWorkInProgressId() > 0) {
            claims.put(JwtTokenNames.ORGANISATION_WORK_IN_PROGRESS_ID, mockUser.organisationWorkInProgressId());
        }

        Collection<GrantedAuthority> authorities = Arrays.stream(mockUser.roles())
                .map(MockSecurityUtils::addRolePrefix)
                .map(SimpleGrantedAuthority::new)
                .collect(
                        Collectors.toUnmodifiableSet());
        OAuth2AuthenticatedPrincipal
                oauthPrincipal = new DefaultOAuth2AuthenticatedPrincipal(claims, authorities);
        Instant issuedAt = Instant.now();
        OAuth2AccessToken credentials =
                new OAuth2AccessToken(TokenType.BEARER, "mock token value", issuedAt, issuedAt.plusSeconds(300));

        final BearerTokenAuthentication bearerTokenAuthentication =
                new BearerTokenAuthentication(oauthPrincipal, credentials, authorities);

        context.setAuthentication(bearerTokenAuthentication);
        return context;
    }
}
