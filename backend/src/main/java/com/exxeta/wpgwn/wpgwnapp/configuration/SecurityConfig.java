package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.api.auth.ApiKeyAuthFilter;
import com.exxeta.wpgwn.wpgwnapp.api.auth.ApiKeyAuthManager;
import com.exxeta.wpgwn.wpgwnapp.api.auth.ApiKeyService;
import com.exxeta.wpgwn.wpgwnapp.security.WpgwnAuthenticationConverter;

@Configuration
@EnableGlobalMethodSecurity(jsr250Enabled = true)
@RequiredArgsConstructor
@Order(2)
public class SecurityConfig {


    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http, ApiKeyService apiKeyService) throws Exception {

        String principalRequestHeader = "x-api-key";
        ApiKeyAuthFilter filter = new ApiKeyAuthFilter(principalRequestHeader);
        filter.setAuthenticationManager(new ApiKeyAuthManager(apiKeyService));

        // @formatter:off
        http.csrf().disable()
                .headers().frameOptions().disable()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(filter, BearerTokenAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
                .and().oauth2ResourceServer()
                .jwt().jwtAuthenticationConverter(new WpgwnAuthenticationConverter().wpgwnTokenConverter());
        // @formatter:on

        return http.build();
    }

}
