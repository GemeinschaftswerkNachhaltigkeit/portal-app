package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

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

/**
 * Response Dto für Organisationen (WIP) bei dem ein Flag für ausstehende Kontaktanfragen hinzugefügt wurde.
 */
@Data
@SuppressWarnings("MagicNumber")
public class OrganisationWorkInProgressWithContactInviteStatusResponseDto implements Serializable {
    private final Long id;
    private final String createdBy;
    private final String lastModifiedBy;
    private final Instant createdAt;
    private final Instant modifiedAt;
    private final long version;

    private final String name;

    private final String description;

    private final Set<Long> sustainableDevelopmentGoals;

    private final ContactDto contact;

    private final Boolean contactInvite;

    private final LocationDto location;

    private final ImpactAreaDto impactArea;

    private final Set<ThematicFocus> thematicFocus;

    private final OrganisationType organisationType;

    private final Boolean privacyConsent;

    private final Set<SocialMediaContactDto> socialMediaContacts;

    private final OrganisationStatus status;

    private final String externalId;

    private Source source;

    private ImportProcessDto importProcess;

    private final String image;

    private final String logo;

    private final LocalDate approvedUntil;
    private final UUID randomUniqueId;

    private final String feedbackRequest;
    private final OffsetDateTime feedbackRequestSent;

    private final String rejectionReason;
}
