package com.exxeta.wpgwn.wpgwnapp.activity;

import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;
import com.exxeta.wpgwn.wpgwnapp.utils.PrincipalMapper;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Component
@RequiredArgsConstructor
public class DanValidator {

    private final UserValidator userValidator;

    private final OrganisationValidator organisationValidator;

    public void checkDanPermission(OAuth2AuthenticatedPrincipal principal, Organisation organisation) {
        // Check if the user has DAN permission
        userHasDanPermission(principal);
        organisationValidator.isUserAuthorizedToAccessOrganisation(principal, organisation);
    }


    public void checkReadOrWriteDanPermission(OAuth2AuthenticatedPrincipal principal,
                                              Organisation organisation, String createBy) {
        userHasDanPermission(principal);
        final Long userOrgId = PrincipalMapper.getUserOrgId(principal);
        final Long orgId = organisation.getId();
        final String userId = principal.getName();
        final String createById = createBy;
        if ((nonNull(userOrgId) && !Objects.equals(orgId, userOrgId))
                || (isNull(userOrgId) && !Objects.equals(userId, createById))) {
            throw new AccessDeniedException("user [" + userId + "] does not have permission to access "
                    + (nonNull(userOrgId) ? "organisation [" + orgId + "]"
                    : "Dan for User [" + createById + "]."));
        }
    }

    private boolean isUserAuthorizedToAccessOrganisation(Long userOrgId, Long orgId, Long defaultDanOrgId) {
        // Check if the user is assigned to any organisation
        if (isNull(userOrgId)) {
            // If the user is not assigned to any organisation, check if the given organisation is the default DAN organisation
            return Objects.equals(orgId, defaultDanOrgId);
        } else {
            // If the user is assigned to an organisation, check if it matches the given organisation
            return Objects.equals(orgId, userOrgId);
        }
    }

    private void userHasDanPermission(OAuth2AuthenticatedPrincipal principal) {
        if (!userValidator.hasDanPermission(principal)) {
            throw new AccessDeniedException(
                    "user [" + principal.getName() + "] does not have permission to access Dan");
        }
    }
}
