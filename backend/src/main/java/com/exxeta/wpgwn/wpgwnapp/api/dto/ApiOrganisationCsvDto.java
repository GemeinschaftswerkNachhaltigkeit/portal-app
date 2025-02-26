package com.exxeta.wpgwn.wpgwnapp.api.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportType;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;

@Data
@SuppressWarnings("MagicNumber")
public class ApiOrganisationCsvDto implements Serializable {
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
    private final String sustainableDevelopmentGoals;

    @Length(max = 200)
    private String contactLastName;

    @Length(max = 200)
    private String contactFirstName;

    @Length(max = 200)
    private String contactPosition;

    @Length(max = 200)
    @Email
    private String contactEmail;

    @Length(max = 200)
    private String contactPhone;

    private String contactImage;

    @Length(max = 200)
    private String locationName;

    @Length(max = 200)
    private String street;

    @Length(max = 40)
    private String streetNo;

    @Length(max = 255)
    private String supplement;

    @Length(max = 6)
    private String zipCode;

    @Length(max = 200)
    private String city;

    @Length(max = 200)
    private String state;

    @Length(max = 200)
    private String country;

    private Boolean online;

    private Boolean privateLocation;

    @URL
    @Length(max = 1000)
    private String url;

    /**
     * Optional, um die Koordinaten wieder löschen zu können. Jackson unterscheidet,
     * ob der Wert nicht vorhanden ist (Optional == null)
     * oder der Wert im Json wurde auf "null" gesetzt (Optional.empty)
     */
    @Schema(implementation = ApiPointSchema.class,
            example = "{ \"type\": \"Point\", \"coordinates\": [30, 10] }")
    private String coordinate;

    @Schema(description = "The thematic focuses of this organisation.")
    private final String thematicFocus;

    @Schema(description = "The logo url of this organisation.")
    private final String logo;

    @Schema(description = "The  background image url of this organisation.")
    private final String image;

    @Schema(description = "The social media links of this organisation.")
    private final String socialMediaContacts;

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
