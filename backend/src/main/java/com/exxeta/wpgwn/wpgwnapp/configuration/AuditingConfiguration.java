package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
public class AuditingConfiguration {

    @Bean
    AuditorAware<String> auditorAware() {
        return new AuditorAwareImpl();
    }

}
