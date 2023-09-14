package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto;


import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

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
    private LocalDate endUntil;
    private UUID randomUniqueId;
    private Boolean featured;
    private String featuredText;

}
