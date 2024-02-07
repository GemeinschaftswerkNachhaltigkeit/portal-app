package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.api.auth.ApiKeyAuthFilter;
import com.exxeta.wpgwn.wpgwnapp.api.auth.ApiKeyAuthManager;
import com.exxeta.wpgwn.wpgwnapp.api.auth.ApiKeyService;
import com.exxeta.wpgwn.wpgwnapp.security.WpgwnAuthenticationConverter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableGlobalMethodSecurity(jsr250Enabled = true)
@RequiredArgsConstructor
@Order(2)
public class SecurityConfig {


    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, ApiKeyService apiKeyService)
            throws Exception {

        String principalRequestHeader = "x-api-key";
        ApiKeyAuthFilter filter = new ApiKeyAuthFilter(principalRequestHeader);
        filter.setAuthenticationManager(new ApiKeyAuthManager(apiKeyService));

        // @formatter:off
        http.csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .addFilterBefore(filter, BearerTokenAuthenticationFilter.class)
                .authorizeHttpRequests(amrmr -> amrmr
                        .requestMatchers(antMatcher("/api/public/**")).permitAll()
                        .requestMatchers(antMatcher("/api/**")).permitAll()
                        .anyRequest().permitAll()
                ).oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt
                        .jwtAuthenticationConverter(new WpgwnAuthenticationConverter().wpgwnTokenConverter())));
        // @formatter:on

        return http.build();
    }

}
