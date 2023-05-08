package com.exxeta.wpgwn.wpgwnapp.activity.dto;

import javax.validation.Valid;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

import org.hibernate.validator.constraints.Length;
import org.springframework.validation.annotation.Validated;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.ActivityTypeDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ImpactAreaDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.LocationDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.PeriodDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.ThematicFocusDto;

@Data
@Validated
@SuppressWarnings("MagicNumber")
public class ActivityRequestDto implements Serializable {

    @NotBlank
    @Length(max = 200)
    private String name;

    @NotBlank
    @Length(max = 3000)
    private String description;

    @Valid
    private final Set<@NotNull @Positive Long> sustainableDevelopmentGoals = new LinkedHashSet<>();

    @NotNull
    @Valid
    private final ContactDto contact;

    @NotNull
    @Valid
    private final LocationDto location;

    @NotNull
    private final ImpactAreaDto impactArea;

    @Valid
    private final PeriodDto period;

    @NotNull
    @NotEmpty
    private final Set<ThematicFocusDto> thematicFocus = new LinkedHashSet<>();

    @NotNull
    private final Set<SocialMediaContactDto> socialMediaContacts = new LinkedHashSet<>();

    @NotNull
    private final ActivityTypeDto activityType;

    private final  String externalId;

    private final LocalDate approvedUntil;

    @NotNull
    @AssertTrue
    private final Boolean privacyConsent;

}
