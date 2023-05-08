package com.exxeta.wpgwn.wpgwnapp.api.auth;

import javax.servlet.http.HttpServletRequest;

import java.util.Objects;
import java.util.UUID;

import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ApiKeyAuthFilter extends AbstractPreAuthenticatedProcessingFilter {

    private final String headerName;

    public ApiKeyAuthFilter(final String headerName) {
        this.headerName = headerName;
    }

    @Override
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
        final String apiToken = request.getHeader(headerName);
        if (Objects.nonNull(apiToken)) {
            try {
                return UUID.fromString(apiToken);
            } catch (IllegalArgumentException e) {
                // ignore silently
            }
        }
        return null;
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
        // No creds when using API key
        return null;
    }
}
