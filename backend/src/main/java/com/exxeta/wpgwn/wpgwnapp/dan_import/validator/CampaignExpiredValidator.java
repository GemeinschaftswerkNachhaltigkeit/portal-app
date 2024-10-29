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
        Instant endMax = danRangeService.getDanSetting().endMax();

        if (isCampaignDateRangeSet(campaign)) {

            if (isStartDateOutsideAllowedRange(campaign, startMin, endMax)) {
                errorMessages.put("date_start", "validation.campaign.is.expired");
            } else if (isCampaignEnded(campaign, startMin, endMax)) {
                errorMessages.put("date_end", "validation.campaign.is.expired");
            }
        }

        if (!errorMessages.isEmpty()) {
            throw new DanXmlImportIgnoredException(errorMessages);
        }
    }

    private boolean isCampaignDateRangeSet(Campaign campaign) {
        return nonNull(campaign.getDateStart()) && nonNull(campaign.getDateEnd());
    }

    private boolean isStartDateOutsideAllowedRange(Campaign campaign, Instant startMin, Instant endMax) {
        return (nonNull(startMin) && campaign.getDateStart().isBefore(startMin))
                || (nonNull(endMax) && campaign.getDateStart().isAfter(endMax));
    }

    private boolean isCampaignEnded(Campaign campaign, Instant startMin, Instant endMax) {
        return (isNull(startMin) || isNull(endMax)) && campaign.getDateEnd().isBefore(Instant.now(clock));
    }
}
