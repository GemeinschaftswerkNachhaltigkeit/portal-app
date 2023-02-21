package com.exxeta.wpgwn.wpgwnapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RandomIdExpiredException extends RuntimeException {
    public RandomIdExpiredException(ActivityWorkInProgress activityWorkInProgress) {
        super("Random Id [" + activityWorkInProgress.getRandomIdGenerationTime() + "] expired");
    }
}
