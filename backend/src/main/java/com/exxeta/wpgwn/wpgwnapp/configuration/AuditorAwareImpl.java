package com.exxeta.wpgwn.wpgwnapp.configuration;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return Optional.ofNullable(authentication)
                .map(Authentication::getPrincipal)
                .map(principal -> {
                    if (principal instanceof AuthenticatedPrincipal) {
                        return ((AuthenticatedPrincipal) principal).getName();
                    }
                    return principal.toString();
                })
                .map(Object::toString);
    }
}
