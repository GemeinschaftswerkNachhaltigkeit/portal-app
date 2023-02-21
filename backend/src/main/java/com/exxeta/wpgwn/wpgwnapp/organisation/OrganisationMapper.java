package com.exxeta.wpgwn.wpgwnapp.organisation;

import java.time.Clock;

import org.mapstruct.AfterMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationDetailsResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.dto.OrganisationResponseDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.SocialMediaContact;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.dto.SocialMediaContactDto;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ImageMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class OrganisationMapper {

    @SuppressWarnings("VisibilityModifier")
    @Autowired
    Clock clock;

    public abstract OrganisationResponseDto organisationToDto(Organisation organisation);

    public abstract OrganisationDetailsResponseDto organisationToDetailsDto(Organisation organisation);

    @Mapping(target = "activities", ignore = true)
    @Mapping(target = "marketplaceItems", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "offerWip", ignore = true)
    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "location", source = "locationWorkInProgress")
    @Mapping(target = "image", source = "image", qualifiedByName = "mapImageOrOrganisationDefault")
    @Mapping(target = "initiator", ignore = true)
    @Mapping(target = "projectSustainabilityWinner", ignore = true)
    public abstract void mapWorkInProgressToOrganisationWithoutActivities(OrganisationWorkInProgress workInProgress,
                                                         @MappingTarget Organisation organisation);

    @Mapping(target = "organisation", source = "organisation")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "activitiesWorkInProgress", ignore = true)
    @Mapping(target = "approvedUntil", ignore = true)
    @Mapping(target = "emailNotificationDates", ignore = true)
    @Mapping(target = "feedbackRequest", ignore = true)
    @Mapping(target = "feedbackRequestSent", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "feedbackRequestList", ignore = true)
    @Mapping(target = "randomUniqueId", expression = "java( java.util.UUID.randomUUID() )")
    @Mapping(target = "randomIdGenerationTime", expression = "java( java.time.Instant.now(clock) )")
    @Mapping(target = "contactWorkInProgress", source = "contact")
    @Mapping(target = "duplicateList", ignore = true)
    @Mapping(target = "locationWorkInProgress", source = "location")
    @Mapping(target = "status", constant = "AKTUALISIERUNG_ORGANISATION")
    public abstract OrganisationWorkInProgress mapOrganisationToWorkInProgress(Organisation organisation);

    /**
     * Setzt Verweise auf die Organisation bei alles SocialMedia Entitäten.
     */
    @AfterMapping
    public void updateOrganisationFromDtoAfterMapping(
            @MappingTarget Organisation organisation) {
        organisation.getSocialMediaContacts()
                .forEach(socialMediaContact -> socialMediaContact.setOrganisation(organisation));
    }

    /**
     * Setzt Verweise auf die OrganisationWorkInProgress bei alles SocialMedia Entitäten.
     */
    @AfterMapping
    public void updateOrganisationFromDtoAfterMapping(
            @MappingTarget OrganisationWorkInProgress organisationWorkInProgress) {
        organisationWorkInProgress.getSocialMediaContacts()
                .forEach(socialMediaContact -> socialMediaContact.setOrganisationWorkInProgress(
                        organisationWorkInProgress));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "organisation", ignore = true)
    abstract SocialMediaContact mapSocialMediaContact(SocialMediaContactDto socialMediaContacts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "organisation", ignore = true)
    abstract SocialMediaContact mapSocialMediaContact(
            com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.SocialMediaContact socialMediaContacts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "organisationWorkInProgress", ignore = true)
    abstract com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.SocialMediaContact
    mapSocialMediaContactToWorkInProgress(SocialMediaContact socialMediaContacts);
}
