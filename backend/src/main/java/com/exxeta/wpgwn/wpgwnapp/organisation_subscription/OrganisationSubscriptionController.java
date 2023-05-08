package com.exxeta.wpgwn.wpgwnapp.organisation_subscription;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.dto.OrganisationSubscriptionRequestDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.dto.OrganisationSubscriptionResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model.OrganisationSubscription;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/v1/organisation-subscription")
@RequiredArgsConstructor
public class OrganisationSubscriptionController {

    private final OrganisationService organisationService;
    private final OrganisationSubscriptionService organisationSubscriptionService;
    private final OrganisationSubscriptionRepository organisationSubscriptionRepository;
    private final OrganisationSubscriptionMapper organisationSubscriptionMapper;

    @GetMapping
    @RolesAllowed(PermissionPool.GUEST)
    public Page<OrganisationSubscriptionResponseDto> getPagedOrganisationSubscriptionForCurrentUser(
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
            return organisationSubscriptionRepository
                .findAllBySubscribedUserId(principal.getName(), pageable)
                .map(organisationSubscriptionMapper::organisationSubscriptionToDto);
    }

    @PostMapping
    @RolesAllowed(PermissionPool.GUEST)
    public OrganisationSubscriptionResponseDto createOrganisationSubscriptionForCurrentUser(
            @RequestBody OrganisationSubscriptionRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        Organisation organisation = organisationService.findById(requestDto.getOrganisationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Organisation", requestDto.getOrganisationId())));

        if (organisationSubscriptionRepository.findBySubscribedUserIdAndOrganisation(principal.getName(), organisation).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Can't create [%s] for [User] with id [%s] and [%s] with id [%s]: [User] is already subscribed this [%s]!",
                            "OrganisationSubscription", principal.getName(), "Organisation", requestDto.getOrganisationId(), "Organisation"));
        }

        return organisationSubscriptionMapper.organisationSubscriptionToDto(organisationSubscriptionService
                .createOrganisationSubscriptionForOrganisationAndUser(organisation, principal.getName()));
    }

    @DeleteMapping
    @RolesAllowed(PermissionPool.GUEST)
    public void deleteOrganisationSubscriptionForCurrentUserByOrgId(
            @RequestBody OrganisationSubscriptionRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        Organisation organisation = organisationService.findById(requestDto.getOrganisationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "Organisation", requestDto.getOrganisationId())));

        OrganisationSubscription organisationSubscription = organisationSubscriptionRepository.findBySubscribedUserIdAndOrganisation(principal.getName(), organisation)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Can't find [%s] for [User] with id [%s] and [%s] with id [%s]!",
                                "OrganisationSubscription", principal.getName(), "Organisation", requestDto.getOrganisationId())));

        organisationSubscriptionRepository.delete(organisationSubscription);
    }

    @DeleteMapping("/{orgSubId}")
    @RolesAllowed(PermissionPool.GUEST)
    public void deleteOrganisationSubscriptionForCurrentUser(
            @PathVariable("orgSubId") Long organisationSubscriptionId,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        OrganisationSubscription organisationSubscription = organisationSubscriptionRepository.findById(organisationSubscriptionId)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with id [%s] not found", "OrganisationSubscription",
                                organisationSubscriptionId)));

        if (!organisationSubscription.getSubscribedUserId().equals(principal.getName())) {
            throw new AccessDeniedException(String.format("User [%s] has no permission for entity [%s] with id [%s].",
                    principal.getName(), "OrganisationSubscription", organisationSubscriptionId));
        }

        organisationSubscriptionRepository.delete(organisationSubscription);
    }
}
