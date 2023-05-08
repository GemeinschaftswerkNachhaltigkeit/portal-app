package com.exxeta.wpgwn.wpgwnapp.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import lombok.experimental.UtilityClass;

import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;

@UtilityClass
public class MockSecurityUtils {

    @NonNull
    public static SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor getSecurityToken(
            @Nullable String username) {
        return getSecurityToken(username, null);
    }

    @NonNull
    public static SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor getSecurityToken(
            @Nullable String username,
            @Nullable Long orgId,
            @Nullable Long orgWipId,
            String... roles) {

        Map<String, Object> claims = new HashMap<>();

        if (Objects.nonNull(orgId)) {
            claims.put(JwtTokenNames.ORGANISATION_ID, orgId);
        }

        if (Objects.nonNull(orgWipId)) {
            claims.put(JwtTokenNames.ORGANISATION_WORK_IN_PROGRESS_ID, orgWipId);
        }
        return getSecurityToken(username, claims, roles);
    }

    public static SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor getSecurityToken(
            @Nullable String username,
            @Nullable Map<String, Object> additionalClaims,
            String... roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", Optional.ofNullable(username).orElse("testuser"));

        if (Objects.nonNull(additionalClaims) && !additionalClaims.isEmpty()) {
            claims.putAll(additionalClaims);
        }

        final List<GrantedAuthority> authorities = Stream.of(roles)
                .map(MockSecurityUtils::addRolePrefix)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toUnmodifiableList());
        return SecurityMockMvcRequestPostProcessors.opaqueToken()
                .authorities(authorities)
                .principal(new DefaultOAuth2AuthenticatedPrincipal(claims, authorities));
    }

    static String addRolePrefix(@NonNull String val) {
        if (val.startsWith("ROLE_")) {
            return val;
        }
        return "ROLE_" + val;
    }

}

