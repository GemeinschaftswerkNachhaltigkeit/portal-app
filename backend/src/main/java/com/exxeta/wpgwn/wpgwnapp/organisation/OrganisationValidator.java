package com.exxeta.wpgwn.wpgwnapp.organisation;

import java.util.Objects;
import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrganisationValidator {

    private final UserValidator userValidator;

    public void hasPermissionForOrganisation(OAuth2AuthenticatedPrincipal principal,
                                      Organisation organisation) {

        if (userValidator.hasRneAdminPermission(principal)) {
            log.trace("Allow access to organisation [{}] for rne admin [{}]",
                    Optional.ofNullable(organisation).map(EntityBase::getId).orElse(null),
                    principal.getName());
            return;
        }

        final Long userOrgId = principal.getAttribute(JwtTokenNames.ORGANISATION_ID);
        final Long orgId = organisation.getId();
        if (!Objects.equals(orgId, userOrgId)) {
            throw new AccessDeniedException("user ["
                    + principal.getName()
                    + "] does not have permission to access organisation ["
                    + organisation
                    + "]. Already assigned to another organisation ["
                    + orgId + "].");
        }
    }

}
