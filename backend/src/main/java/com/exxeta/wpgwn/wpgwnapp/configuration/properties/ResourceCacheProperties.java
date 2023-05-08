package com.exxeta.wpgwn.wpgwnapp.configuration.properties;

import javax.validation.constraints.NotBlank;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Validated
@ConfigurationProperties(prefix = "wpgwn.cache")
@Data
public class ResourceCacheProperties {

    private boolean enabled = true;

    @DurationUnit(ChronoUnit.DAYS)
    private Duration maxAge;

    @DurationUnit(ChronoUnit.DAYS)
    private Duration sMaxAge;

    private boolean cachePublic = true;

    private boolean cachePrivate = false;

    private boolean mustRevalidate = true;

    private List<@NotBlank String> pathPatterns =
            List.of("/email/images/**",
                    "/assets/img/**",
                    "*.ttf",
                    "*.woff2",
                    "*.js");

    private List<@NotBlank String> resourceLocations =
            List.of("classpath:/static/",
                    "classpath:/static/email/images/",
                    "classpath:/static/assets/img/",
                    "classpath:/public/");

}
