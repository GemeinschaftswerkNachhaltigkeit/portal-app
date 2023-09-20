package com.exxeta.wpgwn.wpgwnapp;

import java.time.Clock;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.StationCmsDto;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsClient;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDataDto;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDto;

import com.google.common.collect.Lists;

import static com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService.DAN_ACCOUNT_KEY;
import static com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService.DAN_RANGE_KEY;

@TestConfiguration
public class CmsClientConfiguration {

    @Autowired
    private Clock clock;

    @Bean
    @Qualifier("cmsClientForTest")
    public CmsClient cmsClientForTest() {
        return new CmsClient() {
            @Override
            public StationCmsDto getStation() {

                StationCmsDto stationCmsDto = new StationCmsDto();
                stationCmsDto.addStation("STATION_1",
                        "22. Mai 2023 Darmstadt Alnatura Konzernzentrale 14:30-17:30 Uhr ", true);
                stationCmsDto.addStation("STATION_2",
                        "27. Juni 2023 Dresden CUBE, TU Dresden 16:00-18:00 Uhr ", true);
                stationCmsDto.addStation("STATION_3",
                        "21. Juli 2023 Bad Aibling \"Einfach Bauen\" 16:00-18:00 Uhr ", true);
                stationCmsDto.addStation("STATION_4", "xx. August Hamburg CCH 16:00-18:00 Uhr ", true);
                stationCmsDto.addStation("STATION_5", "15. September Freiburg Neues Rathaus xx-xx Uhr", true);
                stationCmsDto.addStation("STATION_6",
                        "16. November Bonn GIZ Campus 16:00-18:00 Uhr", true);
                stationCmsDto.addStation("STATION_7",
                        "14. Dezember Berlin Wilmina Hotel xx-xx Uhr", true);
                stationCmsDto.addStation("STATION_8",
                        "Abschlussevent, Berlin, 15. Dezember 2023, ab 9:30 Uhr", true);
                return stationCmsDto;
            }

            @Override
            public FeatureDataDto getFeatures() {
                FeatureDto danAccount = FeatureDto.builder().feature(DAN_ACCOUNT_KEY)
                        .active(true)
                        .start(LocalDateTime.now(clock).minusYears(1))
                        .end(LocalDateTime.now(clock).plusYears(1)).build();
                FeatureDto danRange = FeatureDto.builder().feature(DAN_RANGE_KEY)
                        .active(true)
                        .start(LocalDateTime.now(clock).minusYears(1))
                        .end(LocalDateTime.now(clock).plusYears(1)).build();
                FeatureDataDto featureDataDto = new FeatureDataDto();
                featureDataDto.setData(Lists.newArrayList(danAccount, danRange));

                return featureDataDto;
            }
        };


    }
}
