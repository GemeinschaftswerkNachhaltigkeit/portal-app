package com.exxeta.wpgwn.wpgwnapp.configuration;

import java.util.List;
import java.util.Objects;

import org.apache.catalina.valves.AccessLogValve;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.AccessLogProperties;
import ch.qos.logback.access.tomcat.LogbackValve;
import lombok.RequiredArgsConstructor;

/**
 * Konfiguriert Logback für das Tomcat Access-Log.
 * Hierfür wird der Standard Access-Log-Handler entfernt und aus dem Logback gesetzt.<br>
 * <br>
 *
 * @author dubowskl
 */
@Configuration
@RequiredArgsConstructor
public class TomcatConfig implements
        WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    private static final String SPRING_APPLICATION_NAME = "spring.application.name";
    private static final List<String> PROPERTIES = List.of(SPRING_APPLICATION_NAME);

    private final AccessLogProperties accessLogProperties;

    private final Environment environment;

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        if (accessLogProperties.isEnabled()) {
            final LogbackValve logbackValve = new LogbackValve();

            addSpringPropertiesInLogbackContext(logbackValve);
            if (Objects.nonNull(accessLogProperties.getConfigPath())) {
                logbackValve.setFilename(accessLogProperties.getConfigPath());
            }
            factory.getEngineValves().removeIf(AccessLogValve.class::isInstance);
            factory.addEngineValves(logbackValve);
        }
    }

    private void addSpringPropertiesInLogbackContext(LogbackValve logbackValve) {
        PROPERTIES.forEach(prop -> logbackValve.putProperty(prop, environment.getProperty(prop)));
    }
}
