package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import java.time.Instant;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import com.google.common.collect.Maps;

import static java.util.Objects.nonNull;

/**
 * CampaignExpiredValidator : Check if a Dan has expired.
 */
@Component
public class CampaignExpiredValidator {


    public void validate(Campaign campaign, Instant now) {

        final Map<String, String> errorMessages = Maps.newConcurrentMap();

        if (nonNull(campaign.getDateStart()) && nonNull(campaign.getDateEnd())
                && campaign.getDateEnd().isBefore(now)) {
            errorMessages.put("date_end", "validation.campaign.is.expired");
        }

        if (!errorMessages.isEmpty()) {
            throw new DanXmlImportIgnoredException(errorMessages);
        }
    }
}
