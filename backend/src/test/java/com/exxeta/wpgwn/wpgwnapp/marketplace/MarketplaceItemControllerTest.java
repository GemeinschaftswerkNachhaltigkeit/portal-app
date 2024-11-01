package com.exxeta.wpgwn.wpgwnapp.marketplace;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.StreamUtils;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceRepository;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.security.WithMockWpgwnUser;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import static com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils.createTestOffer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class MarketplaceItemControllerTest {

    private static final String BASE_API_URL = "/api/v1/marketplace";
    @Autowired
    Clock clock;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private MarketplaceRepository marketplaceRepository;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private AuditingHandler handler;
    private DateTimeProvider dateTimeProvider;
    private Organisation organisation;

    @BeforeEach
    void setUp() {
        organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        dateTimeProvider = () -> Optional.of(LocalDateTime.ofInstant(Instant.now(clock), ZoneId.systemDefault()));
        handler.setDateTimeProvider(dateTimeProvider);
    }

    @AfterEach
    void tearDown() {
        marketplaceRepository.deleteAll();
        organisationRepository.deleteAll();
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void findOffers() throws Exception {

        MarketplaceItem testMarketplaceItem = createTestOffer(organisation);
        testMarketplaceItem = marketplaceRepository.save(testMarketplaceItem);
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer/expected-get-offers.json")
                .getInputStream(), StandardCharsets.UTF_8);

        mockMvc.perform(get(BASE_API_URL, organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    void getOfferById() throws Exception {

        MarketplaceItem testMarketplaceItem = createTestOffer(organisation);
        testMarketplaceItem.setEndUntil(OffsetDateTime.now(clock));
        testMarketplaceItem = marketplaceRepository.save(testMarketplaceItem);
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer/expected-get-offer-by-id.json")
                .getInputStream(), StandardCharsets.UTF_8);
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse().getContentAsString();
        System.out.println(responseString);

        mockMvc.perform(get(BASE_API_URL + "/" + testMarketplaceItem.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-09-08T00:00:00.000Z"), ZoneId.of("Europe/Berlin"));
        }
    }
}
