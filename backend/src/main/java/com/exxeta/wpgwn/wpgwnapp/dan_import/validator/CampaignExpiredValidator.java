package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import com.google.common.collect.Maps;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

/**
 * CampaignExpiredValidator : Check if a Dan has expired.
 */
@Component
@RequiredArgsConstructor
public class CampaignExpiredValidator {

    private final Clock clock;

    private final DanRangeService danRangeService;

    public void validate(Campaign campaign) {

        final Map<String, String> errorMessages = Maps.newConcurrentMap();

        Instant startMin = danRangeService.getDanSetting().startMin();

        if (nonNull(campaign.getDateStart()) && nonNull(campaign.getDateEnd())) {

            if (nonNull(startMin) && campaign.getDateStart().isBefore(startMin)) {
                errorMessages.put("date_start", "validation.campaign.is.expired");

            } else if (isNull(startMin) && campaign.getDateEnd().isBefore(Instant.now(clock))) {
                errorMessages.put("date_end", "validation.campaign.is.expired");
            }
        }

        if (!errorMessages.isEmpty()) {
            throw new DanXmlImportIgnoredException(errorMessages);
        }
    }
}
