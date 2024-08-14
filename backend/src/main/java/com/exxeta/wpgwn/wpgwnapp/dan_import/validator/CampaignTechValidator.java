package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import java.time.temporal.Temporal;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import com.google.common.base.Strings;
import com.google.common.collect.Maps;

import static java.util.Objects.nonNull;

@Component
@RequiredArgsConstructor
public class CampaignTechValidator {

    private final WpgwnProperties wpgwnProperties;

    public static void isRequired(String stringValue, String field, Map<String, String> messages) {
        isRequired(stringValue, field, "validation." + field + ".required", messages);
    }

    public static void isRequired(String stringValue, String field, String message, Map<String, String> messages) {
        if (Strings.isNullOrEmpty(stringValue)) {
            messages.put(field, message);
        }
    }

    public static void isRequired(Temporal temporal, String field, Map<String, String> messages) {
        isRequired(temporal, field, "validation." + field + ".required", messages);
    }

    public static void isRequired(Temporal temporal, String field, String message, Map<String, String> messages) {
        if (Objects.isNull(temporal)) {
            messages.put(field, message);
        }
    }

    public void validate(Campaign campaign) {

        final Map<String, String> errorMessages = Maps.newConcurrentMap();

        isRequired(campaign.getId(), "id", errorMessages);

        if (wpgwnProperties.getDan().getSdgRequired()) {
            isRequired(campaign.getCategory(), "category", errorMessages);
        }

        isRequired(campaign.getName(), "name", errorMessages);
        isRequired(campaign.getDetailText(), "detailtext", errorMessages);
        isRequired(campaign.getOrganizer(), "organizer", errorMessages);
        isRequired(campaign.getOrganizerEmail(), "organizer_email", errorMessages);
        isRequired(campaign.getDateStart(), "date_start", errorMessages);
        isRequired(campaign.getDateEnd(), "date_end", errorMessages);
        if (nonNull(campaign.getDateStart()) && nonNull(campaign.getDateEnd())) {
            if (campaign.getDateStart().isAfter(campaign.getDateEnd())) {
                errorMessages.put("date_end", "validation.date_end.must.after.date_start");
            }
        }

        if (!errorMessages.isEmpty()) {
            throw new DanXmlImportCancelledException(errorMessages);
        }
    }
}
