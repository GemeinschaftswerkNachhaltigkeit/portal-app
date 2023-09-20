package com.exxeta.wpgwn.wpgwnapp.security;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;

import static org.assertj.core.api.Assertions.assertThat;

class WpgwnAuthenticationConverterTest {

    private final WpgwnAuthenticationConverter converter = new WpgwnAuthenticationConverter();

    @Test
    void wpgwnTokenConverter() {
        // Given
        Map<String, Object> headers = new HashMap<>();
        headers.put("test1", "test");
        Map<String, Object> claims = new HashMap<>();
        Map<String, List<String>> resourceMap = new HashMap<>();
        claims.put("resource_access", resourceMap);

        Jwt jwt = new Jwt("test", Instant.now(), Instant.now().plusSeconds(20), headers, claims);

        // When
        BearerTokenAuthentication result =
                converter.wpgwnTokenConverter().convert(jwt);

        // Then
        assertThat(result.getAuthorities()).isNotNull();
        assertThat(result.getAuthorities()).isEmpty();

    }

    @Test
    void wpgwnTokenConverterWithRoles() {
        // Given
        Map<String, Object> headers = new HashMap<>();
        headers.put("test1", "test");
        Map<String, Object> claims = new HashMap<>();
        Map<String, Map<String, List<String>>> resourceMap = new HashMap<>();
        Map<String, List<String>> rolesMap = new HashMap<>();
        rolesMap.put("roles", List.of("ROLE_role1", "role2"));
        resourceMap.put("wpgwn-app", rolesMap);
        claims.put("resource_access", resourceMap);

        Jwt jwt = new Jwt("test", Instant.now(), Instant.now().plusSeconds(20), headers, claims);

        // When
        BearerTokenAuthentication result =
                converter.wpgwnTokenConverter().convert(jwt);

        // Then
        assertThat(result.getAuthorities())
                .contains(new SimpleGrantedAuthority("ROLE_role1"), new SimpleGrantedAuthority("ROLE_role2"));


    }
}
