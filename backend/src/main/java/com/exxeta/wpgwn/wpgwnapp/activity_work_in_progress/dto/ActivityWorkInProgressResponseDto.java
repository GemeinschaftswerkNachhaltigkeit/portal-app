package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto;

import java.io.Serializable;
import java.util.Set;

import com.exxeta.wpgwn.wpgwnapp.shared.model.BannerImageMode;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportProcessDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ActivityTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SpecialTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
public class ActivityWorkInProgressResponseDto implements Serializable {
    private final Long id;
    private final Set<Long> sustainableDevelopmentGoals;
    private final ContactDto contact;
    private final LocationDto location;
    private final Set<ThematicFocusDto> thematicFocus;
    private final ImportProcessDto importProcess;
    private final String randomUniqueId;
    private String name;
    private String description;
    private ImpactAreaDto impactArea;
    private ActivityTypeDto activityType;
    private SpecialTypeDto specialType;
    private Set<SocialMediaContactDto> socialMediaContacts;
    private String registerUrl;
    private PeriodDto period;
    private String logo;
    private String image;
    private BannerImageMode bannerImageMode;
}
