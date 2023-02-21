package com.exxeta.wpgwn.wpgwnapp.api.auth;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.api.auth.model.ApiKey;

public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID>, QuerydslPredicateExecutor<ApiKey> {

    @Transactional(readOnly = true)
    Optional<ApiKey> findByKeycloakUserId(String keycloakUserId);

    @Transactional
    void deleteByKeycloakUserId(String keycloakUserId);

}
