package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import java.io.IOException;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;

import static org.assertj.core.api.Assertions.assertThat;

class ZipCodeServiceTest {

    private final ResourceLoader resourceLoader = new DefaultResourceLoader();

    private final ZipCodeReader zipCodeReader = new ZipCodeReader(new CsvMapper());

    @BeforeEach
    void setUp() {
    }

    @Test
    void readValues() throws IOException {
        Map<String, ZipCode> result = zipCodeReader.readValues(
                resourceLoader.getResource("classpath:/zip_code_mapping/zuordnung_plz_ort.csv"));

        assertThat(result).hasSize(8170);

    }
}
