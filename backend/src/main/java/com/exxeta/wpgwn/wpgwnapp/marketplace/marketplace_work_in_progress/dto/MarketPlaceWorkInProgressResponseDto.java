package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto;


import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
public class MarketPlaceWorkInProgressResponseDto {

    private Long id;
    private String createdBy;
    private String lastModifiedBy;
    private OffsetDateTime createdAt;
    private OffsetDateTime modifiedAt;
    private long version;
    private String name;
    private String description;
    private MarketplaceType marketplaceType;
    private LocationDto location;
    private Set<ThematicFocusDto> thematicFocus;
    private String image;
    private ContactDto contact;
    private OffsetDateTime endUntil;
    private UUID randomUniqueId;
    private Boolean featured;
    private String featuredText;

}
