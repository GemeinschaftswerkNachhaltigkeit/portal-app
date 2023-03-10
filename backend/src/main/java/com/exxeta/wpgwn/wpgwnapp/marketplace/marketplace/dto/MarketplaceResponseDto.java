package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto;


import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.OrganisationDataDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
public abstract class MarketplaceResponseDto {

    private Long id;
    private String name;
    private String description;
    private LocationDto location;
    private Set<ThematicFocusDto> thematicFocus;
    private ContactDto contact;
    private String image;
    private OrganisationDataDto organisation;
    private MarketplaceType marketplaceType;

}
