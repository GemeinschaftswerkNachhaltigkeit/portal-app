package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlQueue;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.service.ImportDanXmlQueueRepository;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.Map;

import static java.util.Objects.nonNull;

@Component
@RequiredArgsConstructor
public class CampaignDuplicateValidator {

    private final ImportDanXmlQueueRepository importDanXmlQueueRepository;

    public boolean validate(Campaign campaign) {
        String danId = campaign.getId();
        ImportDanXmlQueue importDanXmlQueueByDanId =
                importDanXmlQueueRepository.findFirstByDanIdOrderByCreatedAtDesc(danId);

        if (nonNull(importDanXmlQueueByDanId)) {
            if (campaign.uniqueKey().equals(importDanXmlQueueByDanId.getUniqueKey())) {
                throw new DanXmlImportIgnoredException(Map.of("campaign", "campaign.duplicate"));
            }
            return true;
        } else {
            return false;
        }
    }
}
