package com.exxeta.wpgwn.wpgwnapp.organisation;

import java.util.Objects;
import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;
import com.exxeta.wpgwn.wpgwnapp.utils.PrincipalMapper;

import static java.util.Objects.isNull;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrganisationValidator {

    private final UserValidator userValidator;

    private final WpgwnProperties wpgwnProperties;

    public void checkPermissionForOrganisation(OAuth2AuthenticatedPrincipal principal,
                                               Organisation organisation) {

        if (userValidator.hasRneAdminPermission(principal)) {
            log.trace("Allow access to organisation [{}] for rne admin [{}]",
                    Optional.ofNullable(organisation).map(EntityBase::getId).orElse(null),
                    principal.getName());
            return;
        }

        isUserAuthorizedToAccessOrganisation(principal, organisation);

    }

    public void isUserAuthorizedToAccessOrganisation(OAuth2AuthenticatedPrincipal principal,
                                                     Organisation organisation) {
        final Long userOrgId = PrincipalMapper.getUserOrgId(principal);
        final Long orgId = organisation.getId();
        final Long defaultDanOrgId = wpgwnProperties.getDanId();
        // Check if the user is assigned to any organisation
        // If the user is not assigned to any organisation, check if the given organisation is the default DAN organisation
        // If the user is assigned to an organisation, check if it matches the given organisation
        boolean isUserAuthorizedToAccessOrganisation =
                isNull(userOrgId) ? Objects.equals(orgId, defaultDanOrgId) : Objects.equals(orgId, userOrgId);
        if (!isUserAuthorizedToAccessOrganisation) {
            // If the user is not authorized, throw an AccessDeniedException
            throw new AccessDeniedException(
                    "User [" + principal.getName() + "] does not have permission to access organisation ["
                            + organisation + "]. " + "Already assigned to another organisation [" + orgId + "].");
        }
    }

    public boolean hasPermissionForOrganisation(OAuth2AuthenticatedPrincipal principal,
                                                Long orgId) {
        if (Objects.isNull(principal)) {
            return false;
        }

        if (userValidator.hasRneAdminPermission(principal)) {
            log.trace("Allow access to organisation [{}] for rne admin [{}]",
                    orgId,
                    principal.getName());
            return true;
        }

        final Long userOrgId = principal.getAttribute(JwtTokenNames.ORGANISATION_ID);
        return Objects.equals(orgId, userOrgId);
    }

}
