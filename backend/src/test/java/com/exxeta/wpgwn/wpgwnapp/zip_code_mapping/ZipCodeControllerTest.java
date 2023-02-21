package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.StreamUtils;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class ZipCodeControllerTest {

    private static final String BASE_API_URL = "/api/v1/zip-codes/{zipCode}";

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
    }

    @Test
    void getZipCodeInfo() throws Exception {
        // Given

        // When
        final String expectedResponse = StreamUtils.copyToString(
                resourceLoader.getResource("classpath:dtos/zip_code/response-04519.json").getInputStream(),
                StandardCharsets.UTF_8);
        mockMvc.perform(get(BASE_API_URL, "04519")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, true));
    }

    @Test
    void getZipCodeInfoNotFound() throws Exception {
        // Given

        // When
        final String expectedResponse = StreamUtils.copyToString(
                resourceLoader.getResource("classpath:dtos/zip_code/response-not-found.json").getInputStream(),
                StandardCharsets.UTF_8);
        mockMvc.perform(get(BASE_API_URL, "222")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isNotFound())
                .andExpect(content().json(expectedResponse, false));
    }
}
