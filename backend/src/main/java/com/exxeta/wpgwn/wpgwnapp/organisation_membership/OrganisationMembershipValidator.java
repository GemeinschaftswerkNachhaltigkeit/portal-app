package com.exxeta.wpgwn.wpgwnapp.organisation_membership;

import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.domain.KeycloakConstants;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;

import lombok.RequiredArgsConstructor;

import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

@Component
@RequiredArgsConstructor
public class OrganisationMembershipValidator {


    private final KeycloakService keycloakService;

    void hasPermissionToJoinOrganisation(UserRepresentation user) throws ValidationException {
        if (!isAllowedToJoinOrganisation(user)) {
            final BindingResult errors = new BeanPropertyBindingResult(user, "user");
            errors.addError(new ObjectError("user", "is not allowed to join organisation."));
            throw new ValidationException(errors);
        }
    }

    boolean isAllowedToJoinOrganisation(UserRepresentation user) {
        return keycloakService.listGroupsForUser(user.getId())
                .stream()
                .map(GroupRepresentation::getPath)
                .noneMatch(path -> path.startsWith(KeycloakConstants.ORGANISATION_GROUP)
                        || path.startsWith(KeycloakConstants.RNE_ADMIN_GROUP));
    }
}
