package com.exxeta.wpgwn.wpgwnapp.api.auth;

import javax.annotation.security.RolesAllowed;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.api.auth.model.ApiKey;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiKeyDto;
import com.exxeta.wpgwn.wpgwnapp.api.exception.ApiKeyNotFoundException;
import com.exxeta.wpgwn.wpgwnapp.api.mapper.ApiKeyMapper;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

@RestController
@RequestMapping("/api/v1/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    private final ApiKeyMapper apiKeyMapper;

    @RolesAllowed(PermissionPool.GUEST)
    @GetMapping
    public ApiKeyDto getApiKey(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        return apiKeyService.getApiKeyByKeycloakUserId(principal.getName())
                .map(apiKeyMapper::mapToDto)
                .orElseThrow(() -> new ApiKeyNotFoundException("No Api Key for user [" + principal + "]"));
    }

    /**
     * Legt einen Api Key an oder aktualisiert den Wert des Api Keys.
     */
    @RolesAllowed(PermissionPool.GUEST)
    @PostMapping
    public ApiKeyDto generateApiKey(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        ApiKey apiKey = apiKeyService.regenerateApiKey(principal.getName());
        return apiKeyMapper.mapToDto(apiKey);
    }

    @RolesAllowed(PermissionPool.GUEST)
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeApiKey(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        apiKeyService.deleteApiKey(principal.getName());
    }
}
