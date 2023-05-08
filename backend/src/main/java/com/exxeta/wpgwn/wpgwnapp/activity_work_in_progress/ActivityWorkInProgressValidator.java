package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Komponente zum Validieren von {@link ActivityWorkInProgress} Objekten.
 */
@Component
public class ActivityWorkInProgressValidator {

    public boolean isImportable(ActivityWorkInProgress activityWorkInProgress) {
        return Objects.nonNull(activityWorkInProgress)
                && hasName(activityWorkInProgress);
    }

    private boolean hasName(ActivityWorkInProgress activityWorkInProgress) {
        return StringUtils.hasText(activityWorkInProgress.getName());
    }

    private boolean hasExternalId(ActivityWorkInProgress activityWorkInProgress) {
        return StringUtils.hasText(activityWorkInProgress.getExternalId());
    }

    private boolean hasContactEmail(ActivityWorkInProgress activityWorkInProgress) {
        return Objects.nonNull(activityWorkInProgress.getContactWorkInProgress())
                && StringUtils.hasText(activityWorkInProgress.getContactWorkInProgress().getEmail());
    }
}
