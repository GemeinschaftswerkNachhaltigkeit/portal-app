package com.exxeta.wpgwn.wpgwnapp.building_housing.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.util.CollectionUtils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class StationCmsDto {

    @JsonProperty("data")
    private List<StationCms> data = new ArrayList<>();

    public StationCmsDto addStation(String key, String title, boolean active) {
        StationDescription stationDescription = new StationDescription(key, title, active);
        if (CollectionUtils.isEmpty(data)) {
            StationCms stationCms = new StationCms();
            stationCms.getStationDescriptions().add(stationDescription);
            data.add(stationCms);
        } else {
            StationCms stationCms = data.get(0);
            stationCms.getStationDescriptions().add(stationDescription);
        }
        return this;
    }

    public Map<String, String> getStations() {
        if (!CollectionUtils.isEmpty(data)) {
            StationCms stationCms = data.get(0);
            if (!CollectionUtils.isEmpty(stationCms.getStationDescriptions())) {
                return stationCms.getStationDescriptions().stream()
                        .filter(StationDescription::isActive)
                        .collect(Collectors.toMap(StationDescription::getKey, StationDescription::getTitle));
            }
        }
        return new HashMap<>();
    }

    @Getter
    @Setter
    @ToString
    public static class StationCms {
        @JsonProperty("turnaround_steps")
        private List<StationDescription> stationDescriptions = new ArrayList<>();
    }

    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StationDescription {

        @JsonProperty("key")
        private String key;

        @JsonProperty("title")
        private String title;

        @JsonProperty("active")
        private boolean active;
    }
}
