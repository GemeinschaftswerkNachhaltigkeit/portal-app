package com.exxeta.wpgwn.wpgwnapp.api.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ActivityTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class ApiActivityResponseDto implements Serializable {

    @Schema(description = "Technical id of activity", example = "1")
    private final Long id;

    @Schema(description = "Internal id of the user that created this activity.")
    private final String createdBy;

    @Schema(description = "Internal id of the user that last modified this activity.")
    private final String lastModifiedBy;

    @Schema(description = "Date when this activity was created.")
    private final OffsetDateTime createdAt;

    @Schema(description = "Date when this activity was created.")
    private final OffsetDateTime modifiedAt;

    @Schema(description = "The name of this activity.")
    private final String name;

    @Schema(description = "The description of this activity.")
    private final String description;

    @Schema(description = "The sustainable development goals of this activity.")
    private final Set<Long> sustainableDevelopmentGoals;

    @Schema(description = "The impact area of this activity.")
    private final ImpactAreaDto impactArea;

    @Schema(description = "The contact details of this activity.")
    private final ContactDto contact;

    @Schema(description = "The location details of this activity.")
    private final LocationDto location;

    @Schema(description = "The thematic focuses of this activity.")
    private final Set<ThematicFocusDto> thematicFocus;

    @Schema(description = "The type of this activity.")
    private final ActivityTypeDto activityType;

    @Schema(description = "External id of the activity, when it was imported from an external data source.", example = "eid1")
    private final String externalId;

    @Schema(description = "register url of the activity")
    private final String registerUrl;

    @Schema(description = "The period when this activity is active.")
    private final PeriodDto period;

    @Schema(description = "The logo url of this activity.")
    private final String logo;

    @Schema(description = "The background image url of this activity.")
    private final String image;

    @Schema(description = "The organisation the manages this activity.")
    private final ApiOrganisationDataDto organisation;
}
