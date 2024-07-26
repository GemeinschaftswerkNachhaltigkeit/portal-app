package com.exxeta.wpgwn.wpgwnapp.organisation.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import com.exxeta.wpgwn.wpgwnapp.shared.model.BannerImageMode;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

/**
 * DTO zum Anlegen von Organisationen
 */
@Data
public class OrganisationRequestDto implements Serializable {

    private final Long id;
    private final String createdBy;
    private final String lastModifiedBy;
    private final OffsetDateTime createdAt;
    private final OffsetDateTime modifiedAt;
    private final long version;
    private final String name;
    private final String description;
    private final Set<Long> sustainableDevelopmentGoals = new LinkedHashSet<>();
    private final ContactDto contact;
    private final LocationDto location;
    private final Set<ThematicFocusDto> thematicFocus = new LinkedHashSet<>();
    private final String logo;
    private final Boolean privacyConsent;
    private final Set<SocialMediaContactDto> socialMediaContacts = new LinkedHashSet<>();
    private final ImpactAreaDto impactArea;
    private final OrganisationType organisationType;
    private final String externalId;
    private final Source source;
    private BannerImageMode bannerImageMode;

//    private final List<ActivityResponseDto> activities;

}
