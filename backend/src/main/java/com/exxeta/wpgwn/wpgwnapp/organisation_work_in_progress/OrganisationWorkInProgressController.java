package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInvite;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.files.FileUploadDto;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressWithContactInviteStatusResponseDto;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;

import io.swagger.v3.oas.annotations.Parameter;

@Transactional
@RestController
@RequestMapping("/api/v1/register-organisation")
@RequiredArgsConstructor
@Slf4j
public class OrganisationWorkInProgressController {

    private final KeycloakService keycloakService;

    private final OrganisationWorkInProgressService organisationWorkInProgressService;

    private final OrganisationWorkInProgressValidator organisationWorkInProgressValidator;

    private final OrganisationWorkInProgressMapper workInProgressMapper;

    private final ContactInviteService contactInviteService;

    private final UserValidator userValidator;

    private final Clock clock;

    /**
     * Legt eine Organisation (work in progress) an, wenn der Benutzer bereits ein Konto hat und eingeloggt ist.
     */
    @RolesAllowed(PermissionPool.GUEST)
    @PostMapping
    public OrganisationWorkInProgressDto createOrganisation(
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {

        final OrganisationWorkInProgress organisationWorkInProgress = new OrganisationWorkInProgress();
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressCreation(principal);

        organisationWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        organisationWorkInProgress.setRandomIdGenerationTime(Instant.now(clock));
        organisationWorkInProgress.setSource(Source.WEB_APP);
        organisationWorkInProgress.setStatus(OrganisationStatus.NEW);
        final OrganisationWorkInProgress savedOrganisationWorkInProgress =
                organisationWorkInProgressService.save(organisationWorkInProgress);

        keycloakService.createKeycloakGroupForOrganisationWorkInProgress(principal, savedOrganisationWorkInProgress);
        final OrganisationWorkInProgress savedOrganisationWorkInProgressWithKeycloakGroupId =
                organisationWorkInProgressService.save(organisationWorkInProgress);
        return workInProgressMapper.organisationWorkInProgressToDto(savedOrganisationWorkInProgressWithKeycloakGroupId);
    }

    /**
     * Der eingeloggte Nutzer übernimmt mit diesem Ausruf Besitz über eine noch nicht vergebene Organisation.
     */
    @RolesAllowed(PermissionPool.GUEST)
    @PostMapping("/{randomUuid}/owner")
    public OrganisationWorkInProgressDto claimOrganisationWorkInProgressOwnership(
            @PathVariable("randomUuid") UUID randomUuid,
            @Parameter(hidden = true)
            @AuthenticationPrincipal
            OAuth2AuthenticatedPrincipal principal) {
        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressClaim(principal,
                organisationWorkInProgress);
        final boolean needsUpdate =
                keycloakService.createKeycloakGroupForOrganisationWorkInProgress(principal, organisationWorkInProgress);
        final OrganisationWorkInProgress savedOrganisationWorkInProgress;
        if (needsUpdate) {
            savedOrganisationWorkInProgress = organisationWorkInProgressService.save(organisationWorkInProgress);
        } else {
            savedOrganisationWorkInProgress = organisationWorkInProgress;
        }

        return workInProgressMapper.organisationWorkInProgressToDto(savedOrganisationWorkInProgress);
    }

    /**
     * Liefert alle Organisationen (work in progress), welche den Benutzernamen als Kontakt-E-Mail Adresse
     * hinterlegt haben.
     * Benötigt einen eingeloggten Benutzer.
     *
     * @return Organisationen, die dem eingeloggten Benutzer zugeordnet werden können.
     */
    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @GetMapping
    public ResponseEntity<OrganisationWorkInProgressDto> getOrganisationWorkInProgress(
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        final Long orgWipId = principal.getAttribute(JwtTokenNames.ORGANISATION_WORK_IN_PROGRESS_ID);

        if (Objects.nonNull(orgWipId)) {
            return organisationWorkInProgressService.findById(orgWipId)
                    .map(workInProgressMapper::organisationWorkInProgressToDto)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new EntityNotFoundException(
                            String.format("Entity [%s] with id [%s] not found", "OrganisationWorkInProgress",
                                    orgWipId)));
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    /**
     * Änderung der Organisation über die zufällige UUID. Der Nutzer kann über einen Link aus einer E-Mail oder
     * über die Organisation in seinem Profil kommen. Benötigt Rechte zur Bearbeitung der Organisation.
     */
    @RolesAllowed({PermissionPool.ORGANISATION_CHANGE, PermissionPool.RNE_ADMIN})
    @PutMapping("/{randomUuid}")
    OrganisationWorkInProgressDto updateOrgWIPByRandomUuid(@PathVariable("randomUuid") UUID randomUuid,
                                                           @Valid @RequestBody
                                                           OrganisationWorkInProgressDto organisationWorkInProgressDto,
                                                           @Parameter(hidden = true) @AuthenticationPrincipal
                                                           OAuth2AuthenticatedPrincipal principal) {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);

        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
                organisationWorkInProgress);

        workInProgressMapper.updateOrganisationWorkInProgressFromDto(organisationWorkInProgressDto,
                organisationWorkInProgress);

        final OrganisationWorkInProgress updatedOrganisationWorkInProgress =
                organisationWorkInProgressService.save(organisationWorkInProgress);

        return workInProgressMapper.organisationWorkInProgressToDto(updatedOrganisationWorkInProgress);
    }

    //    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @PutMapping("/{randomUuid}/logo")
    public FileUploadDto updateOrganisationLogo(@PathVariable("randomUuid") UUID randomUuid,
                                                @RequestParam("file") MultipartFile file,
                                                @Parameter(hidden = true) @AuthenticationPrincipal
                                                OAuth2AuthenticatedPrincipal principal)
            throws IOException, ValidationException {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);

//        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
//                organisationWorkInProgress);

        final OrganisationWorkInProgress organisation =
                organisationWorkInProgressService.saveOrganisationLogo(organisationWorkInProgress, file);
        return new FileUploadDto(organisation.getLogo());
    }

    //    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @DeleteMapping("/{randomUuid}/logo")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganisationLogo(@PathVariable("randomUuid") UUID randomUuid,
                                       @Parameter(hidden = true) @AuthenticationPrincipal
                                       OAuth2AuthenticatedPrincipal principal)
            throws IOException, ValidationException {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);

//        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
//                organisationWorkInProgress);

        organisationWorkInProgressService.deleteOrganisationLogo(organisationWorkInProgress);
        organisationWorkInProgressService.save(organisationWorkInProgress);
    }

    //    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @PutMapping("/{randomUuid}/image")
    public FileUploadDto updateOrganisationImage(@PathVariable("randomUuid") UUID randomUuid,
                                                 @RequestParam("file") MultipartFile file,
                                                 @Parameter(hidden = true) @AuthenticationPrincipal
                                                 OAuth2AuthenticatedPrincipal principal
    ) throws IOException, ValidationException {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
//        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
//                organisationWorkInProgress);

        final OrganisationWorkInProgress savedOrganisationWorkInProgress =
                organisationWorkInProgressService.saveOrganisationImage(organisationWorkInProgress, file);
        return new FileUploadDto(savedOrganisationWorkInProgress.getImage());
    }

    //    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @DeleteMapping("/{randomUuid}/image")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganisationImage(@PathVariable("randomUuid") UUID randomUuid,
                                        @Parameter(hidden = true) @AuthenticationPrincipal
                                        OAuth2AuthenticatedPrincipal principal
    ) throws IOException, ValidationException {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
//        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
//                organisationWorkInProgress);

        organisationWorkInProgressService.deleteOrganisationImage(organisationWorkInProgress);
        organisationWorkInProgressService.save(organisationWorkInProgress);
    }


    //    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @PutMapping("/{randomUuid}/contact/image")
    public FileUploadDto updateOrganisationContactImage(@PathVariable("randomUuid") UUID randomUuid,
                                                        @RequestParam("file") MultipartFile file,
                                                        @Parameter(hidden = true) @AuthenticationPrincipal
                                                        OAuth2AuthenticatedPrincipal principal
    ) throws IOException, ValidationException {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
//        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
//                organisationWorkInProgress);

        final OrganisationWorkInProgress organisation =
                organisationWorkInProgressService.saveOrganisationContactImageLogo(organisationWorkInProgress, file);
        return new FileUploadDto(organisation.getContactWorkInProgress().getImage());
    }

    //    @RolesAllowed(PermissionPool.ORGANISATION_CHANGE)
    @DeleteMapping("/{randomUuid}/contact/image")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrganisationContactImage(@PathVariable("randomUuid") UUID randomUuid,
                                               @Parameter(hidden = true) @AuthenticationPrincipal
                                               OAuth2AuthenticatedPrincipal principal
    ) throws IOException, ValidationException {

        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
//        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
//                organisationWorkInProgress);

        organisationWorkInProgressService.deleteOrganisationContactImageLogo(organisationWorkInProgress);
        organisationWorkInProgressService.save(organisationWorkInProgress);
    }

    /**
     * Ruft eine Organisation (WIP) ab. Benötigt keine Berechtigungen (notwendig um Status der Organisation (wip)
     * für die Bestätigung der Privacy Policy zu prüfen und Namen der Org anzuzeigen)
     */
    @GetMapping("/{randomUuid}")
    public OrganisationWorkInProgressWithContactInviteStatusResponseDto getOrgWIPByRandomUuid(
            @PathVariable("randomUuid") UUID randomUuid) {
        final OrganisationWorkInProgress organisationWorkInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
        final List<ContactInvite> contactInvite =
                contactInviteService.getContactInvite(organisationWorkInProgress);
        return workInProgressMapper.organisationWorkInProgressToDto(organisationWorkInProgress,
                contactInvite.stream().findFirst().orElse(null));
    }

    /**
     * Reicht eine Organisation mit vollständig ausgefüllten Feldern zur Prüfung bei der Clearingstelle ein.
     *
     * @param randomUuid die ID der einzureichenden Organisation
     */
    @PostMapping("/{uuid}/releases")
    @RolesAllowed({PermissionPool.ORGANISATION_PUBLISH, PermissionPool.RNE_ADMIN})
    @Transactional
    public void submitOrganisationWorkInProgressForApproval(@PathVariable("uuid") UUID randomUuid,
                                                            @Parameter(hidden = true) @AuthenticationPrincipal
                                                            OAuth2AuthenticatedPrincipal principal) {

        final OrganisationWorkInProgress workInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgressModification(principal,
                workInProgress);

        organisationWorkInProgressValidator.validateOrganisationForApproval(workInProgress);

        final String adminGroup = keycloakService.getAdminsGroupId(workInProgress.getKeycloakGroupId());
        final String adminUserId = keycloakService.getFirstUserWithEmailInGroup(adminGroup)
                .orElseThrow(() -> new IllegalArgumentException("Unable to find user admin user in group ["
                        + adminGroup + "]"));

        organisationWorkInProgressService.handleSubmitForApproval(workInProgress, adminUserId);
    }

    /**
     * Der Kontakt der Organisation verweigert die Mitmacherklärung.
     * und möchte nicht auf der Platform veröffentlicht werden.
     *
     * @param randomUuid die ID der Organisation, bei der die Einwilligungserklärung verweigert werden soll.
     */
    @PostMapping("/{id}/deny-privacy-policy")
    public void organisationWorkInProgressDenyPrivacyPolicy(@PathVariable("id") UUID randomUuid) {
        final OrganisationWorkInProgress workInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);

        organisationWorkInProgressValidator.hasPermissionForOrganisationPrivacyContent(workInProgress);

        workInProgress.setStatus(OrganisationStatus.FREIGABE_VERWEIGERT_KONTAKT_INITIATIVE);
        workInProgress.setPrivacyConsent(false);
        organisationWorkInProgressService.save(workInProgress);
    }

    /**
     * Der Kontakt der Organisation stimmt der Mitmacherklärung zu und kann anschließend die Daten pflegen.
     *
     * @param randomUuid die ID der Organisation, bei der die Einwilligungserklärung zugestimmt werden soll.
     */
    @PostMapping("/{id}/accept-privacy-policy")
    public void organisationWorkInProgressAcceptPrivacyPolicy(@PathVariable("id") UUID randomUuid) {
        final OrganisationWorkInProgress workInProgress =
                organisationWorkInProgressService.getOrganisationWorkInProgress(randomUuid);

        organisationWorkInProgressValidator.hasPermissionForOrganisationPrivacyContent(workInProgress);

        workInProgress.setStatus(OrganisationStatus.NEW);
        workInProgress.setPrivacyConsent(true);
        organisationWorkInProgressService.save(workInProgress);
    }

    @Transactional
    @DeleteMapping("/{orgWipId}")
    @RolesAllowed({PermissionPool.ORGANISATION_DELETE, PermissionPool.RNE_ADMIN})
    public void deleteOrganisationWorkInProgress(
            @PathVariable("orgWipId") Long orgWipId,
            @Parameter(hidden = true) @AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal
    ) {
        OrganisationWorkInProgress organisationWip =
                organisationWorkInProgressService.getOrganisationWorkInProgressById(orgWipId);
        organisationWorkInProgressValidator.hasPermissionForOrganisationWorkInProgress(principal, organisationWip);

        organisationWorkInProgressService.deleteOrganisationWorkInProgress(organisationWip);
    }
}
