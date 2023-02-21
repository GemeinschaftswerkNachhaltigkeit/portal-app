package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.SmartValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.shared.ContactValidator;
import com.exxeta.wpgwn.wpgwnapp.shared.model.EntityBase;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrganisationWorkInProgressValidator {

    private static final List<OrganisationStatus> STATUS_VALID_FOR_SUBMISSION =
            List.of(OrganisationStatus.NEW, OrganisationStatus.RUECKFRAGE_CLEARING,
                    OrganisationStatus.AKTUALISIERUNG_ORGANISATION,
                    OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
    private static final List<OrganisationStatus> STATUS_VALID_FOR_MODIFICATION =
            List.of(OrganisationStatus.NEW, OrganisationStatus.RUECKFRAGE_CLEARING,
                    OrganisationStatus.AKTUALISIERUNG_ORGANISATION,
                    OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
    private static final List<OrganisationStatus> STATUS_VALID_FOR_CLEARING =
            List.of(OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION, OrganisationStatus.RUECKFRAGE_CLEARING);
    private static final List<OrganisationStatus> STATUS_VALID_FOR_PRIVACY_CONSENT =
            List.of(OrganisationStatus.PRIVACY_CONSENT_REQUIRED);

    private final OrganisationMapper organisationMapper;

    private final ContactValidator contactValidator;

    private final UserValidator userValidator;

    private final SmartValidator smartValidator;

    /**
     * Validierung, ob ein Nutzer die Organisation bearbeiten darf.
     *
     * @throws ValidationException falls die Organisation im falschen Status ist.
     */
    void hasPermissionForOrganisationWorkInProgressModification(OAuth2AuthenticatedPrincipal principal,
                                                                OrganisationWorkInProgress workInProgress) {

        hasPermissionForOrganisationWorkInProgress(principal, workInProgress, false);

        final BindingResult errors =
                checkOrganisationWorkInProgressStatus(workInProgress, STATUS_VALID_FOR_MODIFICATION);
        if (errors.hasErrors()) {
            throw new ValidationException(errors);
        }
    }

    void hasPermissionForOrganisationWorkInProgress(OAuth2AuthenticatedPrincipal principal,
                                                    @Nullable OrganisationWorkInProgress organisationWorkInProgress) {
        hasPermissionForOrganisationWorkInProgress(principal, organisationWorkInProgress, true);
    }

    void hasPermissionForOrganisationWorkInProgress(OAuth2AuthenticatedPrincipal principal,
                                                    @Nullable OrganisationWorkInProgress organisationWorkInProgress,
                                                    boolean noOrganisationAssignedAllowed) {
        if (userValidator.hasRneAdminPermission(principal)) {
            log.trace("Allow access to organisation work in progress [{}] for rne admin [{}]",
                    Optional.ofNullable(organisationWorkInProgress).map(EntityBase::getId).orElse(null),
                    principal.getName());
            return;
        }

        final Long orgWorkInProgressId = principal.getAttribute(JwtTokenNames.ORGANISATION_WORK_IN_PROGRESS_ID);
        final Long orgId = principal.getAttribute(JwtTokenNames.ORGANISATION_ID);

        if (!noOrganisationAssignedAllowed
                && Objects.isNull(orgWorkInProgressId) == Objects.isNull(orgId)) {
            throw new AccessDeniedException("user ["
                    + principal.getName()
                    + "] is not assigned to an organisation.");
        }

        if (Objects.nonNull(orgWorkInProgressId)
                && Objects.nonNull(organisationWorkInProgress)
                && !Objects.equals(organisationWorkInProgress.getId(), orgWorkInProgressId)) {
            throw new AccessDeniedException("user ["
                    + principal.getName()
                    + "] does not have permission to access organisation ["
                    + organisationWorkInProgress
                    + "]. Already assigned to another organisation work in progress");
        }

        final Long wipAttachedOrgId =
                Optional.ofNullable(organisationWorkInProgress)
                        .map(OrganisationWorkInProgress::getOrganisation)
                        .map(EntityBase::getId)
                        .orElse(null);
        if (Objects.nonNull(orgId)
                && (Objects.isNull(wipAttachedOrgId)
                || !Objects.equals(wipAttachedOrgId, orgId))) {
            throw new AccessDeniedException("user ["
                    + principal.getName()
                    + "] does not have permission to access organisation ["
                    + organisationWorkInProgress
                    + "]. Already assigned to another organisation ["
                    + wipAttachedOrgId + "].");
        }
    }

    /**
     * Validiert, ob die Organisation vollständig ist und zum Clearing übergeben werden kann.
     */
    void validateOrganisationForApproval(OrganisationWorkInProgress workInProgress) {

        final Organisation organisationForValidation = new Organisation();
        organisationMapper.mapWorkInProgressToOrganisationWithoutActivities(workInProgress, organisationForValidation);
        final BindingResult errors =
                new BeanPropertyBindingResult(organisationForValidation, "OrganisationForValidation");
        checkOrganisationWorkInProgressStatus(workInProgress, STATUS_VALID_FOR_SUBMISSION, errors);
        smartValidator.validate(organisationForValidation, errors);
        if (!StringUtils.hasText(organisationForValidation.getKeycloakGroupId())) {
            errors.addError(
                    new FieldError("organisation", "user", "zur Organisation wurde keine Benutzerzuordnung gefunden."));
        }

        contactValidator.validate(workInProgress.getContactWorkInProgress(), "organisation", "contact.", errors);

        if (errors.hasErrors()) {
            throw new ValidationException(errors);
        }
    }

    public void hasPermissionForOrganisationWorkInProgressClearingByAdmin(OrganisationWorkInProgress workInProgress) {
        final BindingResult errors =
                checkOrganisationWorkInProgressStatus(workInProgress, STATUS_VALID_FOR_CLEARING);

        if (errors.hasErrors()) {
            throw new ValidationException(errors);
        }
    }

    public void hasPermissionForOrganisationPrivacyContent(OrganisationWorkInProgress workInProgress) {
        final BindingResult errors =
                checkOrganisationWorkInProgressStatus(workInProgress, STATUS_VALID_FOR_PRIVACY_CONSENT);

        if (errors.hasErrors()) {
            throw new ValidationException(errors);
        }
    }

    private BindingResult checkOrganisationWorkInProgressStatus(@NonNull OrganisationWorkInProgress workInProgress,
                                                                @NonNull List<OrganisationStatus> validStatusList) {
        final BindingResult errors =
                new BeanPropertyBindingResult(workInProgress, "OrganisationWorkInProgress");
        return checkOrganisationWorkInProgressStatus(workInProgress, validStatusList, errors);
    }

    private BindingResult checkOrganisationWorkInProgressStatus(@NonNull OrganisationWorkInProgress workInProgress,
                                                                @NonNull List<OrganisationStatus> validStatusList,
                                                                @NonNull BindingResult errors) {
        final OrganisationStatus status = workInProgress.getStatus();
        if (!hasStatus(status, validStatusList)) {
            final String name = Optional.of(errors).map(Errors::getObjectName).orElse("organisation");
            errors.addError(new FieldError(name, "status", "ist nicht " + validStatusList));
        }
        return errors;
    }

    private static boolean hasStatus(@NonNull OrganisationStatus status,
                                     @NonNull List<OrganisationStatus> validStatusList) {
        return validStatusList.contains(status);
    }

    public void hasPermissionForOrganisationWorkInProgressCreation(OAuth2AuthenticatedPrincipal principal) {
        hasPermissionForOrganisationWorkInProgress(principal, null);
    }

    /**
     * Prüft, ob der Nutzer noch keiner bzw. der angegebenen Organisation bzw. Organisation (Work In Progress)
     * zugeordnet ist.
     */
    public void hasPermissionForOrganisationWorkInProgressClaim(OAuth2AuthenticatedPrincipal principal,
                                                                OrganisationWorkInProgress organisationWorkInProgress) {
        hasPermissionForOrganisationWorkInProgress(principal, organisationWorkInProgress);
    }
}
