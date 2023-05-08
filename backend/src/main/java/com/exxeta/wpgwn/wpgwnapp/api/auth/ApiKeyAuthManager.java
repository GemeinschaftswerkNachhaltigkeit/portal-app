package com.exxeta.wpgwn.wpgwnapp.api.auth;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.github.benmanes.caffeine.cache.CacheLoader;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;

@Slf4j
public class ApiKeyAuthManager implements AuthenticationManager {

    public static final Duration DURATION = Duration.of(5, ChronoUnit.MINUTES);
    private final LoadingCache<UUID, Boolean> keys;

    public ApiKeyAuthManager(ApiKeyService apiKeyService) {
        this.keys = Caffeine.newBuilder()
                .expireAfterAccess(DURATION)
                .build(new DatabaseCacheLoader(apiKeyService));
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        UUID principal = (UUID) authentication.getPrincipal();
        ApiKeyAuthentication apiKeyAuth = new ApiKeyAuthentication(principal);

        if (Boolean.TRUE.equals(keys.get(principal))) {
            apiKeyAuth.setAuthenticated(true);
        } else {
            //            throw new BadCredentialsException("The API key was not found or not the expected value.");
            apiKeyAuth.setAuthenticated(false);
            log.debug("Not api key found on request.");
        }

        return apiKeyAuth;
    }

    /**
     * Caffeine CacheLoader that checks the database for the api key if it not found in the cache.
     */
    @RequiredArgsConstructor
    private static class DatabaseCacheLoader implements CacheLoader<UUID, Boolean> {

        private final ApiKeyService apiKeyService;

        @Override
        public Boolean load(UUID apiKey) {
            if (Objects.isNull(apiKey)) {
                log.debug("No api key provided.");
                return false;
            }

            log.info("Loading api key from database: [key: {}]", apiKey);
            return apiKeyService.isValidApiKey(apiKey);
        }
    }
}
