package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;

@Component
public class ActivityWorkInProgressImportValidator {


    /**
     * Prüft, ob die Aktivität für den Import valide ist.
     *
     */
    public boolean isValidActivity(ActivityWorkInProgress activityWorkInProgress) {
        return Objects.nonNull(activityWorkInProgress)
                && StringUtils.hasText(activityWorkInProgress.getName())
                && StringUtils.hasText(activityWorkInProgress.getDescription());
    }
}
