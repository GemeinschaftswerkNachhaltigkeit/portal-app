package com.exxeta.wpgwn.wpgwnapp.configuration.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.boot.context.properties.bind.DefaultValue;

import lombok.Getter;

/**
 * Bietet die Konfigurationsmöglichkeiten für das Access-Logging für den Tomcat mit Logback.<br>
 * <br>
 *
 * @author dubowskl
 */
@Getter
@ConfigurationProperties(prefix = "access-log")
@ConstructorBinding
public class AccessLogProperties {

    /**
     * Der Pfad zur Datei für die Logback-Konfiguration. Dieser kann sich im Classpath befinden oder auf dem System.
     */
    private final String configPath;
    /**
     * Schalter zur Aktivierung des Access-Logs über Logback. Wenn dieses Logging und das von dem Tomcat aktiv ist,
     * wird das Verhalten des Tomcats überschrieben/ignoriert.
     *
     * <p>Standardwert ist: false
     */
    private final boolean enabled;

    AccessLogProperties(String configPath, @DefaultValue("false") boolean enabled) {
        this.configPath = configPath;
        this.enabled = enabled;
    }
}
