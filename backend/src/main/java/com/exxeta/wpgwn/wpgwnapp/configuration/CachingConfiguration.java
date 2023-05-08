package com.exxeta.wpgwn.wpgwnapp.configuration;

import java.util.Objects;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.ResourceCacheProperties;

/**
 * Eigene Cache Konfiguration um nur bestimmte Resourcen zu cachen. Insbesondere wollen wir nicht die
 * <ul>
 *     <li>index.html</li>
 *     <li>i18n/de.json</li>
 * </ul>
 * cachen, weil sonst bei Auslieferungen die Anwendung nicht mehr geladen werden kann
 * (alte index.html verweist auf Resourcen, die es nicht mehr gibt)
 * oder alte Sprachdateien werden verwendet und neu hinzugefügte Werte fehlen unter Umständen.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class CachingConfiguration implements WebMvcConfigurer {

    private final ResourceCacheProperties cacheProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        if (!cacheProperties.isEnabled()) {
            log.info("Caching of static resources disabled");
            return;
        }

        final CacheControl cacheControl;
        if (Objects.nonNull(cacheProperties.getMaxAge())) {
            cacheControl = CacheControl.maxAge(cacheProperties.getMaxAge());
        } else {
            cacheControl = CacheControl.empty();
        }

        if (Objects.nonNull(cacheProperties.getSMaxAge())) {
            cacheControl.sMaxAge(cacheProperties.getSMaxAge());
        }

        if (cacheProperties.isCachePublic()) {
            cacheControl.cachePublic();
        }

        if (cacheProperties.isCachePrivate()) {
            cacheControl.cachePrivate();
        }

        if (cacheProperties.isMustRevalidate()) {
            cacheControl.mustRevalidate();
        }

        registry.addResourceHandler(cacheProperties.getPathPatterns().toArray(String[]::new))
                .addResourceLocations(cacheProperties.getResourceLocations().toArray(String[]::new))
                .setCacheControl(cacheControl);
    }
}

