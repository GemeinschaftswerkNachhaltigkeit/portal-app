package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.ActuatorSecurityProperties;

/**
 * Security configuration to access Actuator Endpoint via HTTP Basic Auth with a configured user.
 */
@Configuration
@Order(1)
@RequiredArgsConstructor
public class ActuatorSecurityConfig {

    public static final String ROLE_ACTUATOR = "ACTUATOR";

    private final ActuatorSecurityProperties properties;

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        final PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        final UserDetails user = User.withUsername(properties.getUsername())
                .password(passwordEncoder.encode(properties.getPassword()))
                .roles(ROLE_ACTUATOR)
                .build();

        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {
        http.requestMatcher(EndpointRequest.toAnyEndpoint())
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().csrf().disable()
                .authorizeRequests()
                .requestMatchers(EndpointRequest.to(HealthEndpoint.class))
                .permitAll()
                .and().authorizeRequests().anyRequest().hasAnyRole(ROLE_ACTUATOR)
                .and().httpBasic();

        return http.build();
    }

}
