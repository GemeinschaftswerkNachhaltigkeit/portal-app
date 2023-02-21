package com.exxeta.wpgwn.wpgwnapp.api.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportType;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class ApiOrganisationResponseDto implements Serializable {
    @Schema(description = "Technical id of organisation", example = "1")
    private final Long id;

    @Schema(description = "Internal id of the user that created this organisation.")
    private final String createdBy;

    @Schema(description = "Internal id of the user that last modified this organisation.")
    private final String lastModifiedBy;

    @Schema(description = "Date when this organisation was created.")
    private final OffsetDateTime createdAt;

    @Schema(description = "Date when this organisation was last modified.")
    private final OffsetDateTime modifiedAt;

    @Schema(description = "The name of this organisation.")
    private final String name;

    @Schema(description = "The description of this organisation.")
    private final String description;

    @Schema(description = "The sustainable development goals of this organisation.")
    private final Set<Long> sustainableDevelopmentGoals = new LinkedHashSet<>();

    @Schema(description = "The contact details of this organisation.")
    private final ContactDto contact;

    @Schema(description = "The location information of this organisation.")
    private final LocationDto location;

    @Schema(description = "The thematic focuses of this organisation.")
    private final Set<ThematicFocusDto> thematicFocus = new LinkedHashSet<>();

    @Schema(description = "The logo url of this organisation.")
    private final String logo;

    @Schema(description = "The  background image url of this organisation.")
    private final String image;

    @Schema(description = "The social media links of this organisation.")
    private final Set<SocialMediaContactDto> socialMediaContacts = new LinkedHashSet<>();

    @Schema(description = "The impact area of this organisation.")
    private final ImpactAreaDto impactArea;

    @Schema(description = "The type of this organisation.")
    private final OrganisationType organisationType;

    @Schema(description = "External id of the organisation, when this organisation was imported from an external data source.", example = "eid1")
    private final String externalId;

    @Schema(description = "The source of this organisation.")
    private final Source source;

    @Schema(description = "The type of import for this organisation if it was imported from an external source.")
    private final ImportType importType;

    @Schema(description = "The import source if this organisation was imported from an external source.")
    private final ImportSource importSource;

    @Schema(description = "Flag for organisations that are initiators of sustainable projects.")
    private final Boolean initiator;

    @Schema(description = "Flag for winner organisations of the project sustainability competition.")
    private final Boolean projectSustainabilityWinner;

}
