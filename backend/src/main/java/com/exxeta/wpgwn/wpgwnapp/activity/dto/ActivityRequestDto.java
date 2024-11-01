package com.exxeta.wpgwn.wpgwnapp.activity.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;
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
    private final String externalId;
    private final LocalDate approvedUntil;
    @NotNull
    @AssertTrue
    private final Boolean privacyConsent;
    @NotBlank
    @Length(max = 200)
    private String name;
    @NotBlank
    @Length(max = 3000)
    private String description;
    @URL
    @Length(max = 1000)
    private String registerUrl;

}
