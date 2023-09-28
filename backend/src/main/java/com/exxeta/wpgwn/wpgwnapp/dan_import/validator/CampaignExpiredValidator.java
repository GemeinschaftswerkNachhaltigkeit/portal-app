package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import com.google.common.collect.Maps;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;

import static com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication.DEFAULT_ZONE_ID;
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

        LocalDateTime startDan = danRangeService.getDanSetting().getStartDan();

        if (nonNull(campaign.getDateStart()) && nonNull(campaign.getDateEnd())) {

            if (nonNull(startDan) && campaign.getDateStart().atZone(DEFAULT_ZONE_ID)
                    .toLocalDateTime().isBefore(startDan)) {
                errorMessages.put("date_start", "validation.campaign.is.expired");

            } else if (isNull(startDan) && campaign.getDateEnd().isBefore(Instant.now(clock))) {
                errorMessages.put("date_end", "validation.campaign.is.expired");
            }
        }

        if (!errorMessages.isEmpty()) {
            throw new DanXmlImportIgnoredException(errorMessages);
        }
    }
}
