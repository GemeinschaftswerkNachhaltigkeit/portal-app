package com.exxeta.wpgwn.wpgwnapp.api.auth;

import java.util.List;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

public class ApiKeyAuthentication extends AbstractAuthenticationToken {

    @NonNull
    private final UUID apiKey;

    /**
     * Creates a token with the supplied array of authorities.
     */
    public ApiKeyAuthentication(@NonNull UUID apiKey) {
        super(List.of(new SimpleGrantedAuthority("ROLE_" + PermissionPool.API)));
        this.apiKey = apiKey;
    }

    @Override
    public Object getCredentials() {
        return apiKey;
    }

    @Override
    public Object getPrincipal() {
        return apiKey;
    }
}
