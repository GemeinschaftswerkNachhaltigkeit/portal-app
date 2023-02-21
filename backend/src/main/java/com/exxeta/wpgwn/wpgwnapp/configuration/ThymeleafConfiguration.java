package com.exxeta.wpgwn.wpgwnapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.bufferings.thymeleaf.extras.nl2br.dialect.Nl2brDialect;

@Configuration
public class ThymeleafConfiguration {

    @Bean
    Nl2brDialect dialect() {
        return new Nl2brDialect();
    }

}
