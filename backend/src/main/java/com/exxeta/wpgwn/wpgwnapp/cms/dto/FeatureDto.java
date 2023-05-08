package com.exxeta.wpgwn.wpgwnapp.cms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

import static com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication.DEFAULT_TIME_ZONE;

@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureDto {

    private boolean active;

    private String feature;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = DEFAULT_TIME_ZONE)
    private LocalDateTime start;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = DEFAULT_TIME_ZONE)
    private LocalDateTime end;
}
