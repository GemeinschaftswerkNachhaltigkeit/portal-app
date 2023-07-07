package com.exxeta.wpgwn.wpgwnapp.dan_import.service;

import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.activity.event.ActivityUpdateEvent;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlProcess;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlQueue;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlResult;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus;
import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlJobEvent;
import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlProcessDto;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlReadException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.mapper.CampaignAddressMapper;
import com.exxeta.wpgwn.wpgwnapp.dan_import.mapper.CampaignSdgMapper;
import com.exxeta.wpgwn.wpgwnapp.dan_import.mapper.ImportDanXmlProcessMapper;
import com.exxeta.wpgwn.wpgwnapp.dan_import.validator.CampaignDuplicateValidator;
import com.exxeta.wpgwn.wpgwnapp.dan_import.validator.CampaignExpiredValidator;
import com.exxeta.wpgwn.wpgwnapp.dan_import.validator.CampaignTechValidator;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaigns;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.shared.model.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus.FINISH;
import static com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus.PENDING;
import static com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportType.INSERT;
import static com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportType.UPDATE;
import static com.exxeta.wpgwn.wpgwnapp.dan_import.utils.HtmlTagRemover.removeHtmlTags;
import static com.exxeta.wpgwn.wpgwnapp.shared.model.Source.DAN_XML;
import static java.util.Objects.nonNull;
import static org.springframework.util.StringUtils.hasText;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImportDanXmlService {

    private final MappingJackson2XmlHttpMessageConverter mappingJackson2XmlHttpMessageConverter;

    private final ImportDanXmlProcessRepository importDanXmlProcessRepository;

    private final CampaignExpiredValidator campaignExpiredValidator;

    private final CampaignDuplicateValidator campaignDuplicateValidator;

    private final CampaignTechValidator campaignTechValidator;

    private final CampaignSdgMapper campaignSdgMapper;

    private final CampaignAddressMapper campaignAddressMapper;

    private final ImportDanXmlProcessMapper importDanXmlProcessMapper;

    private final ImportDanXmlQueueRepository importDanXmlQueueRepository;

    private final OrganisationService organisationService;

    private final ActivityRepository activityRepository;

    private final ObjectMapper objectMapper;

    private final ApplicationEventPublisher applicationEventPublisher;

    private final Clock clock;

    private final String[] defaultImages = {
            "activities/act1.jpg",
            "activities/act2.jpg",
            "activities/act3.jpg",
            "activities/act4.jpg",
            "activities/act5.jpg",
            "activities/act6.jpg"};

    public Campaigns loadXmlFromFile(MultipartFile xmlFile) {
        ObjectMapper xmlMapper = mappingJackson2XmlHttpMessageConverter.getObjectMapper();
        try {
            return xmlMapper.readValue(xmlFile.getInputStream(), Campaigns.class);
        } catch (Exception ex) {
            throw new DanXmlReadException("Error parsing content of xml file " + xmlFile.getOriginalFilename(), ex);
        }
    }

    public List<ImportDanXmlProcessDto> findAllDanImport() {
        return importDanXmlProcessRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(importDanXmlProcessMapper::mapperImportDanXmlProcess)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    public ImportDanXmlProcessDto findByImportId(String importId) {

        ImportDanXmlProcess importDanXmlProcessByImportId =
                importDanXmlProcessRepository.findImportDanXmlProcessByImportId(importId);
        ImportDanXmlProcessDto importDanXmlProcessDto =
                importDanXmlProcessMapper.mapperImportDanXmlProcess(importDanXmlProcessByImportId);
        if (nonNull(importDanXmlProcessDto)) {
            return importDanXmlProcessDto;
        }
        throw new EntityNotFoundException(
                String.format("Entity [%s] with id [%s] not found", "ImportDanXmlProcess", importId));
    }


    @EventListener
    @Async
    @SneakyThrows
    public void importDanJobEventListener(ImportDanXmlJobEvent jobEvent) {
        final ImportDanXmlProcess importDanXmlProcess =
                startProcess(jobEvent.getImportFilename(), jobEvent.getImportKey());
        final ImportDanXmlResult importDanXmlResult = new ImportDanXmlResult();
        validateAndImport(jobEvent.getCampaigns(), importDanXmlProcess, importDanXmlResult);
        finishImportDanXmlProcess(importDanXmlProcess, importDanXmlResult);
    }

    private void finishImportDanXmlProcess(ImportDanXmlProcess importDanXmlProcess,
                                           ImportDanXmlResult importDanXmlResult)
            throws JsonProcessingException {
        importDanXmlProcess.setImportStatus(FINISH);
        importDanXmlProcess.setReport(objectMapper.writeValueAsString(importDanXmlResult));
        importDanXmlProcessRepository.save(importDanXmlProcess);
    }

    private ImportDanXmlProcess startProcess(String filename, String importId) {
        final ImportDanXmlProcess importDanXmlProcess = new ImportDanXmlProcess();
        importDanXmlProcess.setImportId(importId);
        importDanXmlProcess.setImportFilename(filename);
        importDanXmlProcess.setImportStatus(ImportStatus.VALIDATE);
        importDanXmlProcessRepository.save(importDanXmlProcess);
        return importDanXmlProcess;
    }

    private void validateAndImport(Campaigns campaigns,
                                   ImportDanXmlProcess importDanXmlProcess,
                                   ImportDanXmlResult importDanXmlResult) {
        Instant now = Instant.now(clock);
        for (Campaign campaign : campaigns.getCampaigns()) {
            try {
                campaignExpiredValidator.validate(campaign, now);
                campaignTechValidator.validate(campaign);
                boolean update = campaignDuplicateValidator.validate(campaign);
                Set<Long> sdgs = campaignSdgMapper.mapperSustainableDevelopmentGoals(campaign);
                Location location = campaignAddressMapper.mapperLocation(campaign);
                insertOrUpdateDan(campaign, sdgs, location, update, importDanXmlProcess.getImportId(),
                        importDanXmlResult);
            } catch (DanXmlImportIgnoredException ex) {
                importDanXmlResult.addIgnored(campaign.getId(), ex.getErrorMessages().toString());
            } catch (DanXmlImportCancelledException ex) {
                importDanXmlResult.addCancelled(campaign.getId(), ex.getErrorMessages().toString());
            } catch (Exception ex) {
                log.error("unknown error: {}", ex);
                importDanXmlResult.addCancelled(campaign.getId(),
                        Map.of("campaign", "campaign.import.error").toString());
            }
        }

        if (!importDanXmlResult.getImported().isEmpty()
                || !importDanXmlResult.getUpdated().isEmpty()) {
            applicationEventPublisher.publishEvent(new ActivityUpdateEvent(new Activity()));
        }
    }

    private void insertOrUpdateDan(Campaign campaign, Set<Long> sdgs, Location location,
                                   boolean isUpdate, String importId, ImportDanXmlResult importDanXmlResult) {

        ImportDanXmlQueue importDanXmlQueue = createImportDanXmlQueue(campaign, isUpdate, importId);
        createOrUpdateDan(importDanXmlQueue, sdgs, location, isUpdate, importDanXmlResult);
    }

    private ImportDanXmlQueue createImportDanXmlQueue(Campaign campaign, boolean isUpdate, String importId) {
        final ImportDanXmlQueue importDanXmlQueue = new ImportDanXmlQueue();
        importDanXmlQueue.setDanId(campaign.getId());
        importDanXmlQueue.setLatitude(campaign.getLatitude());
        importDanXmlQueue.setLongitude(campaign.getLongitude());
        importDanXmlQueue.setCategory(campaign.getCategory());
        importDanXmlQueue.setAimed(campaign.getAimed());
        importDanXmlQueue.setVenue(campaign.getVenue());
        importDanXmlQueue.setName(campaign.getName());
        importDanXmlQueue.setIntroText(campaign.getIntroText());
        importDanXmlQueue.setDetailText(removeHtmlTags(campaign.getDetailText()));
        importDanXmlQueue.setOrganizer(campaign.getOrganizer());
        importDanXmlQueue.setOrganizerEmail(campaign.getOrganizerEmail());
        importDanXmlQueue.setOrganizerTel(campaign.getOrganizerTel());
        importDanXmlQueue.setOrganizerWebsite(campaign.getOrganizerWebsite());
        importDanXmlQueue.setImage(campaign.image());
        importDanXmlQueue.setLink(campaign.getLink());
        importDanXmlQueue.setDateStart(campaign.getDateStart());
        importDanXmlQueue.setDateEnd(campaign.getDateEnd());
        importDanXmlQueue.setImportId(importId);
        importDanXmlQueue.setImportType(isUpdate ? UPDATE : INSERT);
        importDanXmlQueue.setImportStatus(PENDING);
        importDanXmlQueue.setUniqueKey(campaign.uniqueKey());
        importDanXmlQueueRepository.save(importDanXmlQueue);
        return importDanXmlQueue;
    }

    private void createOrUpdateDan(ImportDanXmlQueue importDanXmlQueue, Set<Long> sdgs, Location location,
                                   boolean isUpdate, ImportDanXmlResult importDanXmlResult) {
        String externalId = importDanXmlQueue.getDanId();
        Activity dan = activityRepository.findActivityByExternalIdAndSource(externalId, DAN_XML);
        if (dan == null) {
            dan = new Activity();
            dan.setExternalId(importDanXmlQueue.getDanId());
            dan.setActivityType(ActivityType.DAN);
            dan.setThematicFocus(Collections.singleton(ThematicFocus.OTHER));
            dan.setImpactArea(ImpactArea.WORLD);
            dan.setSource(DAN_XML);
            dan.setStatus(ItemStatus.ACTIVE);
            dan.setOrganisation(organisationService.getDefaultDanOrganisation());
        }
        dan.setName(importDanXmlQueue.getName());
        dan.setDescription(importDanXmlQueue.getDetailText());
        Contact contact = new Contact();
        contact.setFirstName(importDanXmlQueue.getOrganizer());
        contact.setLastName(importDanXmlQueue.getOrganizer());
        contact.setEmail(importDanXmlQueue.getOrganizerEmail());
        contact.setPhone(importDanXmlQueue.getOrganizerTel());
        dan.setContact(contact);
        dan.setLocation(location);
        dan.setImage(getImage(importDanXmlQueue.getImage()));
        dan.setPeriod(new Period(importDanXmlQueue.getDateStart(), importDanXmlQueue.getDateEnd()));
        dan.setSustainableDevelopmentGoals(sdgs);
        activityRepository.save(dan);
        importDanXmlQueue.setActivityId(dan.getId());
        importDanXmlQueue.setImportStatus(FINISH);
        importDanXmlQueueRepository.save(importDanXmlQueue);
        if (isUpdate) {
            importDanXmlResult.addUpdated(externalId);
        } else {
            importDanXmlResult.addImported(externalId);
        }
    }

    private String getImage(String image) {
        if (hasText(image)) {
            return image;
        }
        Random random = new Random();
        int index = random.nextInt(defaultImages.length);
        return defaultImages[index];
    }

}
