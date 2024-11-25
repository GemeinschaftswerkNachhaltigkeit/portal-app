package com.exxeta.wpgwn.wpgwnapp.api.mapper;

import java.io.IOException;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiOrganisationCsvDto;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiOrganisationResponseDto;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiCsvMapper {

    private final CsvMapper csvMapper;

    private final ApiOrganisationMapper apiOrganisationMapper;

    private final Clock clock;

    public Resource organisationsToCsv(List<ApiOrganisationResponseDto> results) {

        List<ApiOrganisationCsvDto> csvDtos = results.stream()
                .map(apiOrganisationMapper::toCsvDto)
                .toList();

        CsvSchema schema = csvMapper.schemaFor(ApiOrganisationCsvDto.class)
                .withHeader()
                .withColumnSeparator(',')
                .withQuoteChar('"');

        try {
            byte[] csvData = csvMapper.writer(schema).writeValueAsBytes(csvDtos);

            return new ByteArrayResource(csvData) {
                @Override
                public String getFilename() {
                    return generateCsvFilename();
                }
            };
        } catch (IOException e) {
            log.error("Error generating CSV for data size: {}", results.size(), e);
            throw new RuntimeException("Error generating CSV", e);
        }
    }

    private String generateCsvFilename() {
        return "organisations_" + LocalDateTime.now(clock).format(DateTimeFormatter.ofPattern("yyyy_MM_dd_HH_mm_ss"))
                + ".csv";
    }
}
