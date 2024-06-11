package com.exxeta.wpgwn.wpgwnapp.activity;

import java.time.Clock;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityDetailsResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityRequestDto;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.ActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity.model.SocialMediaContact;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;


@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ImageMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class ActivityMapper {

    @SuppressWarnings("VisibilityModifier")
    @Autowired
    Clock clock;

    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "source", ignore = true)
    @Mapping(target = "organisation", ignore = true)
    @Mapping(target = "importProcess", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    abstract Activity activityDtoToActivity(ActivityRequestDto activityRequestDto);

    public abstract ActivityResponseDto activityToDto(Activity activity);

    public abstract ActivityDetailsResponseDto activityToDetailsDto(Activity activity);

    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "source", ignore = true)
    @Mapping(target = "organisation", ignore = true)
    @Mapping(target = "importProcess", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    abstract void updateActivityFromDto(ActivityRequestDto activityRequestDto, @MappingTarget Activity activity);

    @Mapping(target = "organisation", source = "workInProgress.organisation")
    @Mapping(target = "location", source = "locationWorkInProgress")
    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "image", source = "image", qualifiedByName = "mapImageOrActivityDefault")
    public abstract void updateActivityWithWorkInProgress(ActivityWorkInProgress workInProgress,
                                                          @MappingTarget Activity activity);

    @Mapping(target = "activity", source = "activity")
    @Mapping(target = "locationWorkInProgress", source = "location")
    @Mapping(target = "contactWorkInProgress", source = "contact")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "specialType", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "organisationWorkInProgress", ignore = true)
    @Mapping(target = "importProcess", ignore = true)
    @Mapping(target = "randomUniqueId", expression = "java( java.util.UUID.randomUUID() )")
    @Mapping(target = "randomIdGenerationTime", expression = "java( java.time.Instant.now(clock) )")
    public abstract ActivityWorkInProgress mapActivityToWorkInProgress(Activity activity);

    @AfterMapping
    public void updateActivityFromDtoAfterMapping(
            @MappingTarget Activity activity) {
        activity.getSocialMediaContacts().forEach(socialMediaContact -> socialMediaContact.setActivity(activity));
    }

    @AfterMapping
    public void updateActivityWorkInProgressAfterMapping(
            @MappingTarget ActivityWorkInProgress activityWorkInProgress) {
        activityWorkInProgress.getSocialMediaContacts()
                .forEach(socialMediaContact -> socialMediaContact.setActivityWorkInProgress(activityWorkInProgress));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "activity", ignore = true)
    abstract SocialMediaContact mapSocialMediaContact(SocialMediaContactDto socialMediaContacts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "activity", ignore = true)
    abstract SocialMediaContact mapSocialMediaContacts(
            com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact socialMediaContact);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "activityWorkInProgress", ignore = true)
    abstract com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.SocialMediaContact mapSocialMediaContacts(
            SocialMediaContact socialMediaContact);
}
