package com.exxeta.wpgwn.wpgwnapp.files;

import jakarta.validation.constraints.NotBlank;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.validation.annotation.Validated;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@ConfigurationProperties(prefix = "file")
@ConstructorBinding
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
