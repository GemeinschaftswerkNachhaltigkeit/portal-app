package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto;


import java.time.OffsetDateTime;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.OrganisationDataDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
public abstract class MarketplaceResponseDetailsDto {

    private Long id;
    private String createdBy;
    private String lastModifiedBy;
    private OffsetDateTime createdAt;
    private OffsetDateTime modifiedAt;
    private long version;
    private String name;
    private String description;
    private LocationDto location;
    private Set<ThematicFocusDto> thematicFocus;
    private String image;
    private ContactDto contact;
    private OrganisationDataDto organisation;

}
