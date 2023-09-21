package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportProcessDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@SuppressWarnings("MagicNumber")
public class OrganisationWorkInProgressWithDuplicateFlagResponseDto implements Serializable {
    private final Long id;
    private final String createdBy;
    private final String lastModifiedBy;
    private final Instant createdAt;
    private final Instant modifiedAt;
    private final long version;

    @Length(max = 100)
    private final String name;

    @Length(max = 3000)
    private final String description;

    @Valid
    private final Set<@Positive @Max(17) Long> sustainableDevelopmentGoals;

    @Valid
    private final ContactDto contact;

    @Valid
    private final LocationDto location;

    private final ImpactAreaDto impactArea;

    @Valid
    private final Set<ThematicFocus> thematicFocus;

    private final OrganisationType organisationType;

    private final Boolean privacyConsent;

    private final Set<@NotNull @Valid SocialMediaContactDto> socialMediaContacts;

    private final OrganisationStatus status;

    private final String externalId;
    private final String image;
    private final String logo;
    private final LocalDate approvedUntil;
    private final UUID randomUniqueId;
    private final String feedbackRequest;
    private final OffsetDateTime feedbackRequestSent;
    @JsonProperty("feedbackHistory")
    private final List<FeedbackHistoryEntryDto> feedbackRequestList;
    private final String rejectionReason;
    private Source source;
    private ImportProcessDto importProcess;
    private boolean hasDuplicates;
}
