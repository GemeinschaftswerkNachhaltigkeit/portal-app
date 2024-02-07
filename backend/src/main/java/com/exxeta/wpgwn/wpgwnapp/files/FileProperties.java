package com.exxeta.wpgwn.wpgwnapp.files;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@ConfigurationProperties(prefix = "file")
@Getter
@Validated
@RequiredArgsConstructor
public class FileProperties {

    /**
     * Verzeichnis, in dem alle Daten gespeichert werden.
     */
    @NotBlank
    private final String baseDirectory;

}
