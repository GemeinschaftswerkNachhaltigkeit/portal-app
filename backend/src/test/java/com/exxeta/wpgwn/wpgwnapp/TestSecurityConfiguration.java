package com.exxeta.wpgwn.wpgwnapp;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.time.Instant;
import java.util.Map;

@TestConfiguration
public class TestSecurityConfiguration {

    @Bean
    JwtDecoder jwtDecoder() {
        return token -> new Jwt("test", Instant.now(), Instant.now().plusSeconds(300), Map.of(), Map.of());
    }
}
