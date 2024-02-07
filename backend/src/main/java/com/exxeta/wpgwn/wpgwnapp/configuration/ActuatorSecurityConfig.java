package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
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
        return http
                .securityMatcher(EndpointRequest.toAnyEndpoint())
                .sessionManagement(ssm -> ssm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(amrmr -> amrmr
                        .requestMatchers(EndpointRequest.to(HealthEndpoint.class)).permitAll()
                        .anyRequest().hasAnyRole(ROLE_ACTUATOR))
                .httpBasic(Customizer.withDefaults())
                .build();
    }

}
