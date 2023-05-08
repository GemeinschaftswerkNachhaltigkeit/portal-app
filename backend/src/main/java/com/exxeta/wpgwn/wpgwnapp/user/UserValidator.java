package com.exxeta.wpgwn.wpgwnapp.user;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserValidator
        implements ConstraintValidator<ValidateUser, User> {

    @Override
    public boolean isValid(User user, ConstraintValidatorContext constraintValidatorContext) {
        return Objects.nonNull(user.getOrganisationId()) ^ Objects.nonNull(user.getOrganisationWorkInProgressId());
    }

    public boolean hasRneAdminPermission(OAuth2AuthenticatedPrincipal principal) {
        return principal.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_" + PermissionPool.RNE_ADMIN));
    }

    public boolean hasDanPermission(OAuth2AuthenticatedPrincipal principal) {
        return principal.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_" + PermissionPool.GUEST))
                && !principal.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_" + PermissionPool.RNE_ADMIN));
    }

}
