package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import java.time.Instant;
import java.util.UUID;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInvite;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteStatus;
import com.exxeta.wpgwn.wpgwnapp.excel_import.ImportProcessMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressWithContactInviteStatusResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.dto.OrganisationWorkInProgressWithDuplicateFlagResponseDto;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;


@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ImportProcessMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {Instant.class, UUID.class, ContactInviteStatus.class})
public abstract class OrganisationWorkInProgressMapper {

    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "location", source = "locationWorkInProgress")
    public abstract OrganisationWorkInProgressDto organisationWorkInProgressToDto(
            OrganisationWorkInProgress organisationWorkInProgress);

    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "location", source = "locationWorkInProgress")
    @Mapping(target = "hasDuplicates", expression = "java( !java.util.Optional.ofNullable(organisationWorkInProgress).map(OrganisationWorkInProgress::getDuplicateList).map(com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList::getDuplicateListItems).map(java.util.Set::isEmpty).orElse(true) )")
    public abstract OrganisationWorkInProgressWithDuplicateFlagResponseDto organisationWorkInProgressToDtoWithDuplicates(
            OrganisationWorkInProgress organisationWorkInProgress);

    @Mapping(target = "id", source = "organisationWorkInProgress.id")
    @Mapping(target = "createdAt", source = "organisationWorkInProgress.createdAt")
    @Mapping(target = "modifiedAt", source = "organisationWorkInProgress.modifiedAt")
    @Mapping(target = "createdBy", source = "organisationWorkInProgress.createdBy")
    @Mapping(target = "lastModifiedBy", source = "organisationWorkInProgress.lastModifiedBy")
    @Mapping(target = "version", source = "organisationWorkInProgress.version")
    @Mapping(target = "contact", source = "organisationWorkInProgress.contactWorkInProgress")
    @Mapping(target = "location", source = "organisationWorkInProgress.locationWorkInProgress")
    @Mapping(target = "status", source = "organisationWorkInProgress.status")
    @Mapping(target = "randomUniqueId", source = "organisationWorkInProgress.randomUniqueId")
    @Mapping(target = "contactInvite", expression = "java( java.util.Optional.ofNullable(contactInvite).map(ContactInvite::getStatus).map(val -> val == ContactInviteStatus.OPEN).orElse(false) )")
    public abstract OrganisationWorkInProgressWithContactInviteStatusResponseDto organisationWorkInProgressToDto(
            OrganisationWorkInProgress organisationWorkInProgress, ContactInvite contactInvite);

    @Mapping(target = "organisation", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "logo", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "feedbackRequest", ignore = true)
    @Mapping(target = "feedbackRequestList", ignore = true)
    @Mapping(target = "feedbackRequestSent", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "keycloakGroupId", ignore = true)
    @Mapping(target = "emailNotificationDates", ignore = true)
    @Mapping(target = "randomUniqueId", ignore = true)
    @Mapping(target = "randomIdGenerationTime", ignore = true)
    @Mapping(target = "activitiesWorkInProgress", ignore = true)
    @Mapping(target = "importProcess", ignore = true)
    @Mapping(target = "duplicateList", ignore = true)
    @Mapping(target = "contactWorkInProgress", source = "contact")
    @Mapping(target = "locationWorkInProgress", source = "location")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    abstract void updateOrganisationWorkInProgressFromDto(OrganisationWorkInProgressDto organisationWorkInProgressDto,
                                                          @MappingTarget
                                                          OrganisationWorkInProgress organisationWorkInProgress);

    @AfterMapping
    public void updateOrganisationWorkInProgressFromDtoAfterMapping(
            @MappingTarget OrganisationWorkInProgress organisationWorkInProgress) {
        organisationWorkInProgress.getSocialMediaContacts()
                .forEach(socialMediaContact -> socialMediaContact.setOrganisationWorkInProgress(
                        organisationWorkInProgress));

        organisationWorkInProgress.getActivitiesWorkInProgress()
                .forEach(activityWorkInProgress -> activityWorkInProgress.setOrganisationWorkInProgress(
                        organisationWorkInProgress));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "organisationWorkInProgress", ignore = true)
    abstract SocialMediaContact mapSocialMediaContact(SocialMediaContactDto socialMediaContacts);

}
