package com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.dto.ActivityWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.excel_import.ImportProcessMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ImportProcessMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class ActivityWorkInProgressMapper {

    @Mapping(target = "activity", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "organisationWorkInProgress", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "randomUniqueId", ignore = true)
    @Mapping(target = "randomIdGenerationTime", ignore = true)
    @Mapping(target = "externalId", ignore = true)
    @Mapping(target = "registerUrl", ignore = true)
    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "importProcess", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "thematicFocus", ignore = true)
    @Mapping(target = "sustainableDevelopmentGoals", ignore = true)
    @Mapping(target = "contactWorkInProgress", ignore = true)
    @Mapping(target = "locationWorkInProgress", ignore = true)
    @Mapping(target = "socialMediaContacts", ignore = true)
    @Mapping(target = "impactArea", ignore = true)
    @Mapping(target = "activityType", ignore = true)
    @Mapping(target = "specialType", ignore = true)
    @Mapping(target = "bannerImageMode", ignore = true)
    @Mapping(target = "period", ignore = true)
    @Mapping(target = "approvedUntil", ignore = true)
    @Mapping(target = "source", constant = "WEB_APP")
    @Mapping(target = "status", constant = "ACTIVE")
    abstract ActivityWorkInProgress activityDtoToActivityWip(Organisation organisation);

    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "location", source = "locationWorkInProgress")
    public abstract ActivityWorkInProgressResponseDto activityWorkInProgressToActivityDto(
            ActivityWorkInProgress activityWorkInProgress);

    @Mapping(target = "activity", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "organisationWorkInProgress", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "organisation", ignore = true)
    @Mapping(target = "randomUniqueId", ignore = true)
    @Mapping(target = "randomIdGenerationTime", ignore = true)
    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "externalId", ignore = true)
    @Mapping(target = "source", ignore = true)
    @Mapping(target = "importProcess", ignore = true)
    @Mapping(target = "contactWorkInProgress", source = "contact")
    @Mapping(target = "locationWorkInProgress", source = "location")
    @Mapping(target = "status", constant = "ACTIVE")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    abstract void updateActivityFromWorkInProgressActivityDto(
            ActivityWorkInProgressRequestDto activityWorkInProgressRequestDto,
            @MappingTarget ActivityWorkInProgress activityWorkInProgress);

    @AfterMapping
    public void updateActivityWorkInProgressFromDtoAfterMapping(
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
    @Mapping(target = "activityWorkInProgress", ignore = true)
    abstract SocialMediaContact mapSocialMediaContact(SocialMediaContactDto socialMediaContacts);
}
