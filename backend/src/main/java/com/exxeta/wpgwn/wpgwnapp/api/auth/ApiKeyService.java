package com.exxeta.wpgwn.wpgwnapp.api.auth;

import java.util.Optional;
import java.util.UUID;

import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.api.auth.model.ApiKey;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;

@Service
@Slf4j
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;

    private final KeycloakService keycloakService;

    public ApiKey regenerateApiKey(String keycloakUserId) {
        apiKeyRepository.deleteByKeycloakUserId(keycloakUserId);
        ApiKey apiKey = new ApiKey();
        apiKey.setKeycloakUserId(keycloakUserId);
        return apiKeyRepository.save(apiKey);
    }

    public boolean isValidApiKey(UUID apiKey) {
        return getApiKeyByKeyId(apiKey)
                .map(ApiKey::getKeycloakUserId)
                .map(keycloakService::getUserResource)
                .map(UserResource::toRepresentation)
                .map(UserRepresentation::isEnabled)
                .orElse(false);
    }

    public Optional<ApiKey> getApiKeyByKeyId(UUID apiKey) {
        return apiKeyRepository.findById(apiKey);
    }

    public Optional<ApiKey> getApiKeyByKeycloakUserId(String keycloakUserId) {
        return apiKeyRepository.findByKeycloakUserId(keycloakUserId);
    }

    public void deleteApiKey(String keycloakUserId) {
        apiKeyRepository.deleteByKeycloakUserId(keycloakUserId);
    }
}
