package com.exxeta.wpgwn.wpgwnapp.activity;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;
import com.exxeta.wpgwn.wpgwnapp.utils.PrincipalMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.Objects;

import static com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType.DAN;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Component
@RequiredArgsConstructor
public class DanValidator {

    private final UserValidator userValidator;

    private final OrganisationValidator organisationValidator;

    private final OrganisationService organisationService;

    private final ActivityRepository activityRepository;

    private final WpgwnProperties wpgwnProperties;

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

    public void validateMaxItemNumber(ActivityWorkInProgress savedDanWorkInProgress,
                                      OAuth2AuthenticatedPrincipal principal) {

        if (DAN != savedDanWorkInProgress.getActivityType()) {
            return;
        }

        long numItemsForOrganisationOrUser = calculateNumItemsForOrganisationOrUser(principal);

        Integer numMaxItemsPerOrganisationOrUser = wpgwnProperties.getDan().getMaxDans();

        if (numItemsForOrganisationOrUser > numMaxItemsPerOrganisationOrUser) {
            throwValidationException(savedDanWorkInProgress, numMaxItemsPerOrganisationOrUser,
                    numItemsForOrganisationOrUser);
        }
    }

    private long calculateNumItemsForOrganisationOrUser(OAuth2AuthenticatedPrincipal principal) {
        long numItemsForOrganisationOrUser = 1;
        final Long userOrgId = PrincipalMapper.getUserOrgId(principal);
        if (isNull(userOrgId)) {
            final String userId = principal.getName();
            numItemsForOrganisationOrUser +=
                    activityRepository.countActivitiesByActivityTypeAndStatusAndCreatedBy(DAN, ItemStatus.ACTIVE,
                            userId);
        } else {
            numItemsForOrganisationOrUser +=
                    activityRepository.countActivitiesByActivityTypeAndStatusAndOrganisation(DAN, ItemStatus.ACTIVE,
                            organisationService.getOrganisation(userOrgId));
        }
        return numItemsForOrganisationOrUser;
    }

    private void throwValidationException(ActivityWorkInProgress savedDanWorkInProgress,
                                          Integer numMaxItemsPerOrganisationOrUser,
                                          long numItemsForOrganisationOrUser) {
        final BindingResult errors = new BeanPropertyBindingResult(savedDanWorkInProgress, DAN.name());
        errors.addError(new ObjectError(DAN.name(),
                " exceeds max number of allowed items [" + numMaxItemsPerOrganisationOrUser
                        + "] but saving this would lead to [" + numItemsForOrganisationOrUser + "]."));
        throw new ValidationException(errors);
    }

    private void userHasDanPermission(OAuth2AuthenticatedPrincipal principal) {
        if (!userValidator.hasDanPermission(principal)) {
            throw new AccessDeniedException(
                    "user [" + principal.getName() + "] does not have permission to access Dan");
        }
    }
}
