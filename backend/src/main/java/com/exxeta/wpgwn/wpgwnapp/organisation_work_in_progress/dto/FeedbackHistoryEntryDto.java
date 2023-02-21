package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class FeedbackHistoryEntryDto implements Serializable {

    private String feedbackRequest;

    private OffsetDateTime feedbackRequestSent;

}
