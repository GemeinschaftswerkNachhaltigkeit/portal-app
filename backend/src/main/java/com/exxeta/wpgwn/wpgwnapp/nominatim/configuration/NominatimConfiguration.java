package com.exxeta.wpgwn.wpgwnapp.nominatim.configuration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@Configuration
public class NominatimConfiguration {

    private static final Duration DURATION = Duration.of(24, ChronoUnit.HOURS);


    @Bean
    public Cache nominatimCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(DURATION)
                .build();
    }
}
