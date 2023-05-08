package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto;

import java.io.Serializable;
import java.util.Set;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportProcessDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ActivityTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
public class ActivityWorkInProgressResponseDto implements Serializable {
    private final Long id;

    private String name;
    private String description;
    private final Set<Long> sustainableDevelopmentGoals;
    private ImpactAreaDto impactArea;
    private final ContactDto contact;
    private final LocationDto location;
    private final Set<ThematicFocusDto> thematicFocus;
    private final ImportProcessDto importProcess;
    private ActivityTypeDto activityType;
    private Set<SocialMediaContactDto> socialMediaContacts;
    private PeriodDto period;
    private String logo;
    private String image;

    private final String randomUniqueId;
}
