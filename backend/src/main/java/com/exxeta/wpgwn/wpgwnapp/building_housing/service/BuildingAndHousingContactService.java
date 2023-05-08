package com.exxeta.wpgwn.wpgwnapp.building_housing.service;

import java.util.Locale;
import java.util.Set;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.building_housing.configuration.BuildingAndHousingContactProperties;
import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.BuildingAndHousingContactFormDto;
import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.StationCmsDto;
import com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.BuildingAndHousingMapper;
import com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.model.BuildingAndHousingContact;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsClient;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsLoadException;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email.Email;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;

import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class BuildingAndHousingContactService {

    private final BuildingAndHousingMapper mapper;

    private final BuildingAndHousingContactRepository buildingAndHousingContactRepository;

    private final EmailProperties emailProperties;

    private final WpgwnProperties wpgwnProperties;

    private final BuildingAndHousingContactProperties contactProperties;
    private final EmailService emailService;

    private final TemplateEngine templateEngine;

    private final MessageSource emailMessageSource;

    private final CmsClient cmsClient;


    public void loadStationDescription(BuildingAndHousingContactFormDto buildingAndHousingContactFormDto) {
        final String email = buildingAndHousingContactFormDto.getEmail();
        final String stationDescriptionFromCms =
                loadStationDescriptionFromCms(buildingAndHousingContactFormDto.getStation());
        final String uniqueHash =
                DigestUtils.md5Hex(email.toLowerCase() + "|" + stationDescriptionFromCms.toLowerCase()).toLowerCase();
        buildingAndHousingContactFormDto.setStationDescription(stationDescriptionFromCms);
        buildingAndHousingContactFormDto.setUniqueHash(uniqueHash);
    }

    public boolean isContactRegistered(String uniqueHash) {
        return buildingAndHousingContactRepository.existsByUniqueHash(uniqueHash);
    }

    public BuildingAndHousingContact save(BuildingAndHousingContactFormDto sourceDto) {

        final BuildingAndHousingContact buildingAndHousingContact =
                mapper.mapperBuildingAndHousing(sourceDto);


        return buildingAndHousingContactRepository.save(buildingAndHousingContact);
    }

    public void sendNotificationToAdmin(BuildingAndHousingContact buildingAndHousingContact) {
        final Email email = Email.builder()
                .htmlText(true)
                .from(emailProperties.getDefaultFrom())
                .tos(contactProperties.getRecipients())
                .subject(getAdminEmailSubject(buildingAndHousingContact.getName()))
                .content(generateMailBody("email/building-housing-contact/email-to-admin", buildingAndHousingContact))
                .build();
        emailService.sendMail(email);
    }

    public void sendNotificationToUser(BuildingAndHousingContact buildingAndHousingContact) {
        final Email email = Email.builder()
                .htmlText(true)
                .from(emailProperties.getDefaultFrom())
                .tos(Set.of(buildingAndHousingContact.getEmail()))
                .subject(getUserEmailSubject())
                .content(generateMailBody("email/building-housing-contact/email-to-user", buildingAndHousingContact))
                .build();
        emailService.sendMail(email);
    }

    private String generateMailBody(String template, BuildingAndHousingContact buildingAndHousingContact) {
        final Context context = new Context(Locale.getDefault());

        context.setVariable("contact", buildingAndHousingContact);
        context.setVariable("urlPrefix", wpgwnProperties.getUrl());
        context.setVariable("emailAssetsBasePath", wpgwnProperties.getEmailAssetBasePath());
        return templateEngine.process(template, context);
    }

    private String getAdminEmailSubject(String name) {
        return getEmailSubject("building-housing-contact.email.admin.subject",
                new Object[] {name});
    }

    private String getUserEmailSubject() {
        return getEmailSubject("building-housing-contact.email.user.subject",
                new Object[] {});
    }

    private String getEmailSubject(String subjectKey, Object[] args) {
        return emailMessageSource.getMessage(subjectKey, args, Locale.getDefault());
    }

    private String loadStationDescriptionFromCms(String station) {
        try {
            StationCmsDto stationCmsDto = cmsClient.getStation();

            if (isNull(stationCmsDto) || !stationCmsDto.getStations().containsKey(station)) {
                throw new RuntimeException("turnaround_steps");
            }
            return stationCmsDto.getStations().get(station);
        } catch (Exception ex) {
            throw new CmsLoadException("turnaround_steps");
        }
    }

}
