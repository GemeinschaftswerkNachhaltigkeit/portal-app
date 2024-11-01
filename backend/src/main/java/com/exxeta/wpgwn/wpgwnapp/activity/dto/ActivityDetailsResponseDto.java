package com.exxeta.wpgwn.wpgwnapp.activity.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;

import com.exxeta.wpgwn.wpgwnapp.shared.model.BannerImageMode;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ActivityTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.OrganisationDataDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
public class ActivityDetailsResponseDto implements Serializable {
    private final Long id;
    private final String createdBy;
    private final String lastModifiedBy;
    private final OffsetDateTime createdAt;
    private final OffsetDateTime modifiedAt;
    private final String name;
    private final String description;
    private final Set<Long> sustainableDevelopmentGoals;
    private final ImpactAreaDto impactArea;
    private final ContactDto contact;
    private final LocationDto location;
    private final Set<ThematicFocusDto> thematicFocus;
    private final ActivityTypeDto activityType;
    private final String externalId;
    private final String registerUrl;
    private final LocalDate approvedUntil;
    private final PeriodDto period;
    private final String logo;
    private final String image;
    private BannerImageMode bannerImageMode;
    private final OrganisationDataDto organisation;
}
