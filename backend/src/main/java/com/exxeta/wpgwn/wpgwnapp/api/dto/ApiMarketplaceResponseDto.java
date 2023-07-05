package com.exxeta.wpgwn.wpgwnapp.api.dto;


import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
public abstract class ApiMarketplaceResponseDto {

    @Schema(description = "Technical id of marketplace", example = "1")
    private Long id;
    @Schema(description = "The name of this marketplace.")
    private String name;
    @Schema(description = "The description of this marketplace.")
    private String description;
    @Schema(description = "The location information of this marketplace.")
    private LocationDto location;
    @Schema(description = "The thematic focuses of this marketplace.")
    private Set<ThematicFocusDto> thematicFocus;
    @Schema(description = "The contact details of this marketplace.")
    private ContactDto contact;
    @Schema(description = "The  background image url of this marketplace.")
    private String image;
    @Schema(description = "The organisation the manages this marketplace.")
    private ApiOrganisationDataDto organisation;
    @Schema(description = "The type of this marketplace.")
    private MarketplaceType marketplaceType;
    @Schema(description = "The status of this marketplace.")
    private ItemStatus status;
    @Schema(description = "Flag for featured")
    private Boolean featured;
    @Schema(description = "The description of feature")
    private String featuredText;

}
