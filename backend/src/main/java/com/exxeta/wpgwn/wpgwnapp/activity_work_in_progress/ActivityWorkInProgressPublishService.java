package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import java.util.Objects;
import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityMapper;
import com.exxeta.wpgwn.wpgwnapp.activity.ActivityService;
import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityUpdateEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationValidator;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;

/**
 * Service zum Veröffentlichen von Aktivitäten (Arbeitsstand). Die Aktivität (wip) wird gelöscht und als
 * "richtige" Aktivität an einer Organisation angelegt.
 *
 * @author schlegti
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityWorkInProgressPublishService {

    private final OrganisationValidator organisationValidator;

    private final ActivityService activityService;

    private final ActivityMapper activityMapper;

    private final ApplicationEventPublisher applicationEventPublisher;

    private final FileStorageService fileStorageService;

    @Transactional
    public Activity updateActivityWithActivityWorkInProgress(ActivityWorkInProgress workInProgress,
                                                             OAuth2AuthenticatedPrincipal principal) {
        final Organisation organisation = Objects.requireNonNull(workInProgress.getOrganisation());
        final Activity activity = Optional.ofNullable(workInProgress.getActivity()).orElse(new Activity());

        organisationValidator.checkPermissionForOrganisation(principal, organisation);

        final boolean logoHasChanged = !Objects.equals(workInProgress.getLogo(), activity.getLogo());
        final String logoPath = activity.getLogo();
        final boolean imageHasChanged = !Objects.equals(workInProgress.getImage(), activity.getImage());
        final String imagePath = activity.getImage();
        final boolean contactImageHasChanged =
                !Objects.equals(getWorkInProgressContactImage(workInProgress), getContactImage(activity));
        final String contactImagePath = getContactImage(activity);

        activityMapper.updateActivityWithWorkInProgress(workInProgress, activity);
        final Activity savedActivity = activityService.save(activity);

        fileStorageService.deleteIfChanged(logoHasChanged, logoPath);
        fileStorageService.deleteIfChanged(imageHasChanged, imagePath);
        fileStorageService.deleteIfChanged(contactImageHasChanged, contactImagePath);

        applicationEventPublisher.publishEvent(new ActivityUpdateEvent(savedActivity));
        return savedActivity;
    }

    private String getContactImage(Activity activity) {
        return Optional.ofNullable(activity)
                .map(Activity::getContact)
                .map(Contact::getImage)
                .orElse(null);
    }

    public String getWorkInProgressContactImage(ActivityWorkInProgress workInProgress) {
        return Optional.ofNullable(workInProgress)
                .map(ActivityWorkInProgress::getContactWorkInProgress)
                .map(ContactWorkInProgress::getImage)
                .orElse(null);
    }
}
