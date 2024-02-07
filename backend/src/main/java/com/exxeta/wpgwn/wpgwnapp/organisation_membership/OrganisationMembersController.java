package com.exxeta.wpgwn.wpgwnapp.organisation_membership;

import jakarta.annotation.security.RolesAllowed;
import java.util.List;
import java.util.stream.Collectors;

import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipRequestDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipsDto;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import io.swagger.v3.oas.annotations.Parameter;

/**
 * Endpunkte für Organisations Nutzeradministratoren zum Verwalten von Benutzern der eigenen Organisation.
 */
@RestController
@RequestMapping("/api/v1/organisations/{orgId}/member")
@RequiredArgsConstructor
@Transactional
public class OrganisationMembersController {

    private final KeycloakService keycloakService;
    private final OrganisationService organisationService;
    private final OrganisationMembershipService organisationMembershipService;
    private final OrganisationMembershipMapper organisationMembershipMapper;
    private final OrganisationValidator organisationValidator;

    @GetMapping
    @RolesAllowed(PermissionPool.OFFER_CHANGE)
    public OrganisationMembershipsDto getUserOfOrganisation(
            @PathVariable("orgId") Long organisationId,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        final List<OrganisationMembershipResponseDto> memberships =
                organisationMembershipService.getByOrganisation(organisation)
                        .map(organisationMembershipMapper::organisationMembershipToDto)
                        .collect(Collectors.toList());

        return new OrganisationMembershipsDto(memberships);
    }

    @PostMapping
    @RolesAllowed(PermissionPool.MANAGE_ORGANISATION_USERS)
    public void inviteUserToOrganisation(
            @PathVariable("orgId") Long organisationId,
            @RequestBody OrganisationMembershipRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        organisationMembershipService.sendOrganisationMembershipInvitationForUser(organisation, requestDto, principal);
    }

    @DeleteMapping
    @RolesAllowed(PermissionPool.MANAGE_ORGANISATION_USERS)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeUserFromOrganisation(
            @PathVariable("orgId") Long organisationId,
            @RequestBody OrganisationMembershipRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = organisationService.getOrganisation(organisationId);
        organisationValidator.checkPermissionForOrganisation(principal, organisation);
        final UserRepresentation user = keycloakService.getUser(requestDto.getEmail());
        final UserResource userResource = keycloakService.getUserResource(user.getId());
        organisationMembershipService.removeUserFromOrganisation(organisation, userResource);
        organisationMembershipService.deleteByOrganisationAndUser(organisation, user.getEmail());
    }
}
