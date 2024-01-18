package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.landing_page;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.email.Email;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

@RestController
@RequestMapping("/api/public/v1/register-organisation")
@RequiredArgsConstructor
public class LandingPageOrganisationWorkInProgressController {

    private final OrganisationWorkInProgressRepository workInProgressRepository;

    private final LandingPageOrganisationMapper landingPageOrganisationMapper;

    private final OrganisationWorkInProgressService organisationWorkInProgressService;

    private final EmailProperties emailProperties;

    private final LandingPageEmailProperties landingPageEmailProperties;

    private final LandingPageContentGenerator landingPageContentGenerator;

    private final EmailService emailService;

    @PostMapping
    LandingPageOrganisationDto registerOrganisation(
            @RequestBody @Valid LandingPageOrganisationDto landingPageOrganisationDto) {


        final OrganisationWorkInProgress organisationWorkInProgress =
                landingPageOrganisationMapper.landingPageToOrganisationWorkInProgress(
                        landingPageOrganisationDto);
        organisationWorkInProgress.setSource(Source.LANDING_PAGE);
        final OrganisationWorkInProgress savedOrganisationWorkInProgress =
                workInProgressRepository.save(organisationWorkInProgress);

        final Email email = Email.builder()
                .htmlText(true)
                .from(emailProperties.getDefaultFrom())
                .tos(landingPageEmailProperties.getRecipients())
                .ccs(landingPageEmailProperties.getCcs())
                .bccs(landingPageEmailProperties.getBccs())
                .subject(landingPageContentGenerator.getSubject())
                .content(landingPageContentGenerator.generateMailBody(landingPageOrganisationDto))
                .build();
        emailService.sendMail(email);

        organisationWorkInProgressService.sendReminderEmail(savedOrganisationWorkInProgress.getId());

        return landingPageOrganisationMapper.organisationWorkInProgressToLandingPageDto(
                savedOrganisationWorkInProgress);
    }

}
