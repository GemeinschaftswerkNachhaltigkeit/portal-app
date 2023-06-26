package com.exxeta.wpgwn.wpgwnapp.configuration;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.util.Random;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;

@Configuration
public class GeneralConfiguration {

    @Bean
    Clock clock() {
        return Clock.systemDefaultZone();
    }

    @Bean
    PathMatchingResourcePatternResolver pathMatchingResourcePatternResolver(ResourceLoader resourceLoader) {
        return new PathMatchingResourcePatternResolver(resourceLoader);
    }

    @Bean
    Random random() throws NoSuchAlgorithmException {
        return SecureRandom.getInstanceStrong();
    }

    @Bean
    public MappingJackson2XmlHttpMessageConverter jaxbConverter() {
        return new MappingJackson2XmlHttpMessageConverter();
    }
}
