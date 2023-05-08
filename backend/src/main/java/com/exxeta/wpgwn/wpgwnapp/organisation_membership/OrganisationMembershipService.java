package com.exxeta.wpgwn.wpgwnapp.organisation_membership;


import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.exception.EntityExpiredException;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.content_generator.OrganisationMembershipExistingUserEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.content_generator.OrganisationMembershipNewUserEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipEmailDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipRequestDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipStatus;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.user.User;
import com.exxeta.wpgwn.wpgwnapp.utils.PasswordGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import javax.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.Objects.nonNull;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganisationMembershipService {

    private final OrganisationMembershipExistingUserEmailContentGenerator
            existingUserEmailContentGenerator;
    private final OrganisationMembershipNewUserEmailContentGenerator newUserEmailContentGenerator;
    private final OrganisationMembershipRepository organisationMembershipRepository;

    private final OrganisationMembershipValidator organisationMembershipValidator;
    private final EmailService emailService;
    private final KeycloakService keycloakService;
    private final WpgwnProperties wpgwnProperties;
    private final PasswordGenerator passwordGenerator;
    private final Clock clock;

    /**
     * Der {@link User} für die angegebene Email-Adresse bekommt eine Einladung für die angegebene {@link Organisation}.
     * Es wird entsprechend eine EMail versendet.
     */
    @Transactional
    public void sendOrganisationMembershipInvitationForUser(
            Organisation organisation, OrganisationMembershipRequestDto requestDto,
            OAuth2AuthenticatedPrincipal principal) {
        try {
            createNewOrganisationMembershipAndSendMailForExistingUser(organisation, requestDto, principal);
        } catch (UsernameNotFoundException notFoundException) {
            createNewOrganisationMembershipAndSendMailForNewUser(organisation, requestDto, principal);
        }
    }

    @Transactional
    public void createNewOrganisationMembershipAndSendMailForExistingUser(
            Organisation organisation, OrganisationMembershipRequestDto requestDto,
            OAuth2AuthenticatedPrincipal principal
    ) throws UsernameNotFoundException {
        UserRepresentation user = keycloakService.getUser(requestDto.getEmail());
        organisationMembershipValidator.hasPermissionToJoinOrganisation(user);
        OrganisationMembership organisationMembership = createNewOrganisationMembership(organisation, user,
                requestDto.getUserType(), false);
        emailService.sendMail(existingUserEmailContentGenerator, new OrganisationMembershipEmailDto(
                organisationMembership, principal.getAttribute(JwtTokenNames.FIRST_NAME),
                principal.getAttribute(JwtTokenNames.LAST_NAME), null));
        organisationMembership.setEmailSent(true);
        organisationMembershipRepository.save(organisationMembership);
    }

    @Transactional
    public void createNewOrganisationMembershipAndSendMailForNewUser(
            Organisation organisation, OrganisationMembershipRequestDto requestDto,
            OAuth2AuthenticatedPrincipal principal
    ) {
        User newUser = new User();
        String oneTimePassword = passwordGenerator.generatePassword(
                wpgwnProperties.getOrganisationMembership().getOneTimePasswordLength());
        newUser.setFirstName(requestDto.getFirstName());
        newUser.setLastName(requestDto.getLastName());
        newUser.setEmail(requestDto.getEmail());
        newUser.setPassword(oneTimePassword);
        UserRepresentation user = keycloakService.getUserResource(
                keycloakService.createKeycloakUser(newUser, List.of(), true)).toRepresentation();
        OrganisationMembership organisationMembership = createNewOrganisationMembership(organisation, user,
                requestDto.getUserType(), true);
        emailService.sendMail(newUserEmailContentGenerator, new OrganisationMembershipEmailDto(
                organisationMembership, principal.getAttribute(JwtTokenNames.FIRST_NAME),
                principal.getAttribute(JwtTokenNames.LAST_NAME), oneTimePassword));
        organisationMembership.setEmailSent(true);

        organisationMembershipRepository.save(organisationMembership);
    }

    /**
     * Erstellt eine neue Mitgliedschaft eines Nutzers in der angegebenen Organisation.
     * Sollte bereits eine akzeptierte Mitgliedschaft vorliegen, wird ein Fehler geworfen.
     * Sollte eine nicht akzeptierte Mitgliedschaft vorliegen, wird diese ersetzt.
     */
    private OrganisationMembership createNewOrganisationMembership(Organisation organisation, UserRepresentation user,
                                                                   OrganisationMembershipUserType userType,
                                                                   boolean createdNewUser) {
        Optional<OrganisationMembership> previousMembershipOpt = organisationMembershipRepository
                .findByOrganisationAndEmail(organisation, user.getEmail());
        if (previousMembershipOpt.isPresent()) {
            OrganisationMembership prevMem = previousMembershipOpt.get();
            if (OrganisationMembershipStatus.ACCEPTED.equals(prevMem.getStatus())) {
                throw new IllegalArgumentException(String.format(
                        "[%s] for [%s] with id [%s] and [%s] with email [%s] already existing and accepted",
                        "OrganisationMembership", "Organisation", organisation.getId(), "User", user.getEmail()));
            }
            organisationMembershipRepository.delete(prevMem);
        }

        OrganisationMembership organisationMembership = new OrganisationMembership();
        organisationMembership.setRandomUniqueId(UUID.randomUUID());
        organisationMembership.setRandomIdGenerationTime(Instant.now(clock));
        organisationMembership.setOrganisation(organisation);
        organisationMembership.setUserType(userType);
        organisationMembership.setEmail(user.getEmail());
        organisationMembership.setFirstName(user.getFirstName());
        organisationMembership.setLastName(user.getLastName());
        organisationMembership.setStatus(OrganisationMembershipStatus.OPEN);
        organisationMembership.setExpiresAt(Instant.now(clock)
                .plus(wpgwnProperties.getOrganisationMembership().getExpireFromCreationInDays()));
        organisationMembership.setCreatedNewUser(createdNewUser);
        return organisationMembership;
    }

    @Transactional
    public OrganisationMembership getOrganisationMembership(UUID uuid, boolean failOnExpire)
            throws EntityExpiredException {
        OrganisationMembership result = organisationMembershipRepository.findByRandomUniqueId(uuid)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Entity [%s] with uuid [%s] not found", "OrganisationMembership", uuid)));
        if (failOnExpire) {
            checkExpire(result);
        }
        return result;
    }

    private void checkExpire(OrganisationMembership organisationMembership) throws EntityExpiredException {
        if (OrganisationMembershipStatus.EXPIRED.equals(organisationMembership.getStatus())
                || (nonNull(organisationMembership.getExpiresAt())
                && OrganisationMembershipStatus.OPEN.equals(organisationMembership.getStatus())
                && organisationMembership.getExpiresAt().isBefore(Instant.now(clock)))
        ) {
            throw new EntityExpiredException(String.format("[%s] with uuid [%s] expired", "OrganisationMembership",
                    organisationMembership.getRandomUniqueId()));
        }
    }

    @Transactional
    public OrganisationMembership changeOrganisationMembershipStatusTo(UUID uuid, OrganisationMembershipStatus status)
            throws EntityExpiredException, ValidationException {
        return changeOrganisationMembershipStatusTo(uuid, status, true);
    }

    @Transactional
    public OrganisationMembership changeOrganisationMembershipStatusTo(UUID uuid,
                                                                       OrganisationMembershipStatus newStatus,
                                                                       Boolean failOnExpire)
            throws EntityExpiredException, ValidationException {
        final OrganisationMembership organisationMembership = getOrganisationMembership(uuid, failOnExpire);
        final UserRepresentation user = keycloakService.getUser(organisationMembership.getEmail());

        organisationMembership.setStatus(newStatus);
        if (!OrganisationMembershipStatus.OPEN.equals(newStatus)) {
            organisationMembership.setClosedAt(Instant.now(clock));
        }

        if (OrganisationMembershipStatus.ACCEPTED.equals(newStatus)) {
            assignUserToOrganisation(organisationMembership.getOrganisation(), user,
                    organisationMembership.getUserType());
            keycloakService.setEmailValidated(user, true);
        }

        return organisationMembershipRepository.save(organisationMembership);
    }

    public Stream<OrganisationMembership> getByOrganisation(Organisation organisation) {
        return organisationMembershipRepository.findAllByOrganisation(organisation);
    }


    public List<UserRepresentation> getAllKeycloakUserByOrganisation(Organisation organisation) {
        return getByOrganisation(organisation)
                .map(OrganisationMembership::getEmail)
                .map(keycloakService::getUser)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void deleteByOrganisationAndUser(Organisation organisation, String email) {
        organisationMembershipRepository.deleteByOrganisationIdAndEmail(organisation.getId(), email);
    }

    /**
     * Der {@link User} für die angegebene E-Mail-Adresse wird der {@link Organisation} zugewiesen.
     *
     * @param organisation
     * @param user
     * @param userType
     */
    public void assignUserToOrganisation(Organisation organisation, UserRepresentation user,
                                         @NotNull OrganisationMembershipUserType userType) {
        organisationMembershipValidator.hasPermissionToJoinOrganisation(user);

        String groupId;
        switch (userType) {
            case MEMBER:
                groupId = organisation.getKeycloakGroupId();
                break;
            case ADMIN:
                groupId = keycloakService.getAdminsGroupId(organisation.getKeycloakGroupId());
                break;
            default:
                throw new IllegalArgumentException("No case defined for user type [" + userType + "]");
        }
        keycloakService.addGroupToUser(user.getId(), groupId);

    }

    /**
     * Der {@link User} für die angegebene E-Mail-Adresse wird von der {@link Organisation} entfernt.
     *
     * @param organisation
     * @param user
     */
    public void removeUserFromOrganisation(Organisation organisation, UserResource user) {
        final UserRepresentation userRepresentation = user.toRepresentation();

        for (GroupRepresentation group : user.groups()) {
            if (Objects.equals(group.getId(), organisation.getKeycloakGroupId())) {
                keycloakService.removeGroupFromUser(userRepresentation.getId(), organisation.getKeycloakGroupId());
                log.debug("Removing user [{}] from group [{}]", userRepresentation.getId(),
                        organisation.getKeycloakGroupId());
            } else {
                final String adminGroupId = keycloakService.getAdminsGroupId(organisation.getKeycloakGroupId());
                if (Objects.equals(group.getId(), adminGroupId)) {
                    int numAdmins = keycloakService.getGroup(adminGroupId).members().size();
                    if (numAdmins <= 1) {
                        log.debug("Unable to delete last administrator from organisation.");
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                "Unable to delete last administrator from organisation.");
                    }

                    log.debug("Removing user [{}] from group [{}]", userRepresentation.getId(),
                            adminGroupId);
                    keycloakService.removeGroupFromUser(userRepresentation.getId(), adminGroupId);
                }
            }
        }
    }

    /**
     * Legt einen Eintrag für den initial angelegten Administrator der Organisation als OrganisationMembership an,
     * um den eigenen Nutzer in der Liste der Nutzer zu sehen.
     *
     * @param savedOrganisation
     */
    @Transactional
    public void createOrganisationMembershipEntry(Organisation savedOrganisation) {
        final String adminGroupId = keycloakService.getAdminsGroupId(savedOrganisation.getKeycloakGroupId());
        final List<UserRepresentation> members = keycloakService.getGroup(adminGroupId).members();

        for (UserRepresentation user : members) {
            OrganisationMembership organisationMembership =
                    createNewOrganisationMembership(savedOrganisation, user, OrganisationMembershipUserType.ADMIN,
                            false);
            organisationMembership.setClosedAt(Instant.now(clock));
            organisationMembership.setExpiresAt(null);
            organisationMembership.setStatus(OrganisationMembershipStatus.ACCEPTED);
            organisationMembershipRepository.save(organisationMembership);
        }
    }

    public void deleteAllByOrganisation(Organisation organisation) {
        organisationMembershipRepository.deleteAllByOrganisation(organisation);
    }
}

