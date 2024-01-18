package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;
import org.springframework.validation.annotation.Validated;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ActivityTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

@Data
@Validated
@SuppressWarnings("MagicNumber")
public class ActivityWorkInProgressRequestDto implements Serializable {

    @Valid
    private final Set<@NotNull @Positive Long> sustainableDevelopmentGoals;
    @Valid
    private final Set<@NotNull @Positive Long> subGoals;
    @Valid
    private final ContactDto contact;
    private final ImpactArea impactArea;
    private final ActivityTypeDto activityType;
    @Valid
    private final LocationDto location;
    private final Set<@NotNull @Valid SocialMediaContactDto> socialMediaContacts;
    @Length(max = 200)
    private String name;
    @Length(max = 3000)
    private String description;
    private Set<@NotNull ThematicFocus> thematicFocus;
    @URL
    @Length(max = 1000)
    private String registerUrl;
    private PeriodDto period;

    private String category;

    private LocalDate approvedUntil;

    private Boolean privacyConsent;

}
