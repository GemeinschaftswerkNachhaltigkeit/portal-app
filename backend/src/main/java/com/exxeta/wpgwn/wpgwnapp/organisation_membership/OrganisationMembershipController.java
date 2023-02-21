package com.exxeta.wpgwn.wpgwnapp.organisation_membership;


import javax.annotation.security.RolesAllowed;
import java.util.Objects;
import java.util.UUID;

import org.keycloak.admin.client.resource.UserResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.exception.EntityExpiredException;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipStatus;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

@RestController
@RequestMapping("/api/v1/organisation-membership")
@RequiredArgsConstructor
public class OrganisationMembershipController {

    private final OrganisationMembershipService organisationMembershipService;
    private final OrganisationService organisationService;
    private final OrganisationMembershipMapper mapper;
    private final KeycloakService keycloakService;

    @PutMapping("/{uuid}")
    public OrganisationMembershipResponseDto updateStatusForOrganisationMembership(@PathVariable("uuid") UUID uuid)
            throws EntityExpiredException, ValidationException {

        OrganisationMembership organisationMembership =
                organisationMembershipService.getOrganisationMembership(uuid, false);
        if (!OrganisationMembershipStatus.OPEN.equals(organisationMembership.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Invalid status for [%s] with uuid [%s]: Only changeable from OPEN, but was [%s]!",
                            "OrganisationMembership", uuid, organisationMembership.getStatus()));
        }

        final OrganisationMembership updatedOrganisationMembership = organisationMembershipService
                .changeOrganisationMembershipStatusTo(uuid, OrganisationMembershipStatus.ACCEPTED);
        return mapper.organisationMembershipToDto(updatedOrganisationMembership);
    }

    /**
     * Endpunkt zum Entfernen des eingeloggten Benutzers aus seiner Organisation.
     *
     * @param principal der aktuell eingeloggte Benutzer.
     */
    @DeleteMapping
    @RolesAllowed({PermissionPool.ORGANISATION_CHANGE})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeLoggedInUserFromOrganisation(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        Long organisationId = principal.getAttribute(JwtTokenNames.ORGANISATION_ID);
        if (Objects.isNull(organisationId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is not associated with an organisation.");
        }

        final Organisation organisation = organisationService.getOrganisation(organisationId);
        final UserResource user = keycloakService.getUserResource(principal.getName());
        organisationMembershipService.removeUserFromOrganisation(organisation, user);
        organisationMembershipService.deleteByOrganisationAndUser(organisation, user.toRepresentation().getEmail());
    }

}
