package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.landing_page;

import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.Instant;
import java.util.UUID;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, imports = {Instant.class, UUID.class})
public abstract class LandingPageOrganisationMapper {

    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "sustainableDevelopmentGoals", source = "dto.sustainabilityGoals")
    @Mapping(target = "description", source = "dto.contribution")
    @Mapping(target = "privacyConsent", source = "dto.privacyConsent")
    @Mapping(target = "contactWorkInProgress.email", source = "dto.emailAddress")
    @Mapping(target = "status", constant = "NEW")
    @Mapping(target = "randomUniqueId", expression = "java( UUID.randomUUID() )")
    @Mapping(target = "randomIdGenerationTime", expression = "java( Instant.now() )")
    abstract OrganisationWorkInProgress landingPageToOrganisationWorkInProgress(LandingPageOrganisationDto dto);

    @Mapping(target = "name", source = "name")
    @Mapping(target = "contribution", source = "description")
    @Mapping(target = "sustainabilityGoals", source = "sustainableDevelopmentGoals")
    @Mapping(target = "emailAddress", source = "contactWorkInProgress.email")
    @Mapping(target = "privacyConsent", source = "privacyConsent")
    abstract LandingPageOrganisationDto organisationWorkInProgressToLandingPageDto(OrganisationWorkInProgress organisationWorkInProgress);

}
