package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;
import com.exxeta.wpgwn.wpgwnapp.shared.model.SustainableDevelopmentGoals;

import com.google.common.base.Splitter;

@Component
public class CampaignSdgMapper {

    private final Map<String, Long> sdgMap;

    public CampaignSdgMapper() {
        sdgMap = Arrays.stream(SustainableDevelopmentGoals.values())
                .collect(Collectors.toMap(SustainableDevelopmentGoals::getNameDe,
                        sdg -> Long.valueOf(sdg.getNumber())));
    }

    public Set<Long> mapperSustainableDevelopmentGoals(Campaign campaign) {

        String categories = campaign.getCategory();
        List<String> sdgTexts = Splitter.on(";").omitEmptyStrings()
                .trimResults()
                .splitToList(categories);

        Set<Long> sustainableDevelopmentGoals = sdgTexts.stream()
                .filter(sdgMap::containsKey)
                .map(sdgMap::get)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (!sustainableDevelopmentGoals.isEmpty()) {
            return sustainableDevelopmentGoals;
        }

        throw new DanXmlImportCancelledException(Map.of("sdg", "validation.sdg.required"));
    }
}
