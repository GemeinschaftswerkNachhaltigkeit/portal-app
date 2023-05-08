package com.exxeta.wpgwn.wpgwnapp.marketplace;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class OrganisationMarketplaceItemControllerTest {

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-09-08T00:00:00.000Z"), ZoneId.of("Europe/Berlin"));
        }
    }

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
    @Autowired
    Clock clock;

    private static final String BASE_API_URL = "/api/v1/organisations/{orgId}/marketplace/offer";

    private Organisation organisation;

    @BeforeEach
    void setUp() {
        organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        DateTimeProvider dateTimeProvider =
                () -> Optional.of(LocalDateTime.ofInstant(Instant.now(clock), ZoneId.systemDefault()));
        handler.setDateTimeProvider(dateTimeProvider);
    }

    @AfterEach
    void tearDown() {
        organisationRepository.deleteAll();
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void findOffers() throws Exception {

        MarketplaceItem testMarketplaceItem = createTestOffer(organisation);
        testMarketplaceItem = marketplaceRepository.save(testMarketplaceItem);
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer/expected-get-organisation-offers.json")
                .getInputStream(), StandardCharsets.UTF_8);

        mockMvc.perform(get(BASE_API_URL, organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    void getOfferById() throws Exception {

        MarketplaceItem testMarketplaceItem = createTestOffer(organisation);
        testMarketplaceItem = marketplaceRepository.save(testMarketplaceItem);
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer/expected-get-offer-by-id.json")
                .getInputStream(), StandardCharsets.UTF_8);

        mockMvc.perform(get(BASE_API_URL + "/" + testMarketplaceItem.getId(), organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void createOfferWorkInProgress() throws Exception {

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer/expected-create-empty-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        mockMvc.perform(post(BASE_API_URL, organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void updateOffer() throws Exception {
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer/expected-update-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        MarketplaceItem testMarketplaceItem = createTestOffer(organisation);
        marketplaceRepository.save(testMarketplaceItem);

        mockMvc.perform(put(BASE_API_URL + "/" + testMarketplaceItem.getId(), organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

}
