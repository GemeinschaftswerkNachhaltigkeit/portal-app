package com.exxeta.wpgwn.wpgwnapp.organisation.dto;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;

@Data
public class OrganisationResponseDto implements Serializable {
    private final Long id;
    private final String name;
    private final String description;
    private final Set<Long> sustainableDevelopmentGoals = new LinkedHashSet<>();
    private final ContactDto contact;
    private final LocationDto location;
    private final Set<ThematicFocusDto> thematicFocus = new LinkedHashSet<>();
    private final String logo;
    private final String image;
    private final Boolean privacyConsent;
    private final Set<SocialMediaContactDto> socialMediaContacts = new LinkedHashSet<>();
    private final ImpactAreaDto impactArea;
    private final OrganisationType organisationType;
    private final Boolean initiator;
    private final Boolean projectSustainabilityWinner;

//    private final List<ActivityResponseDto> activities;

}
