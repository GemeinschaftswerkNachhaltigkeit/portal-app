package com.exxeta.wpgwn.wpgwnapp.ui_properties;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * Endpunkte zum Laden der UI Konfiguration vom Backend.
 */
@RestController
@RequestMapping("/api/v1/ui")
@RequiredArgsConstructor
public class UiConfigController {

    private final UiConfigProperties properties;

    private final UiPropertiesMapper mapper;

    @GetMapping("ui-config")
    public UiConfigPropertiesDto getUiConfig() {
        return mapper.map(properties);
    }

}
