package com.exxeta.wpgwn.wpgwnapp.marketplace_work_in_progress;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.hamcrest.Matchers;
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
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.StreamUtils;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceMapper;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.MarketplaceRepository;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.MarketPlaceWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.security.WithMockWpgwnUser;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import static com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils.createTestOffer;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class OrganisationMarketplaceItemWorkInProgressControllerTest {

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
    private MarketPlaceWorkInProgressRepository marketPlaceWorkInProgressRepository;

    @Autowired
    private MarketplaceRepository marketplaceRepository;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private MarketplaceMapper mapper;

    @Autowired
    private AuditingHandler handler;
    @Autowired
    Clock clock;

    private static final String BASE_API_URL = "/api/v1/organisations/{orgId}/marketplace-wip/offer";

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
    void getOfferByIdWorkInProgress() throws Exception {

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/expected-get-offer-wip-by-id.json")
                .getInputStream(), StandardCharsets.UTF_8);

        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(get(BASE_API_URL + "/" + testOfferWip.getRandomUniqueId(), organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void getOffersWorkInProgress() throws Exception {

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/expected-get-offers-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(get(BASE_API_URL, organisation.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void deleteOffer() throws Exception {
        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(delete(BASE_API_URL + "/" + testOfferWip.getRandomUniqueId(), organisation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        assertThat(marketPlaceWorkInProgressRepository.findAll()).isEmpty();
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void updateOffer() throws Exception {

        String requestBody = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/request-update-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/expected-update-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(put(BASE_API_URL + "/" + testOfferWip.getRandomUniqueId(), organisation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    @WithMockWpgwnUser(roles = {PermissionPool.RNE_ADMIN, PermissionPool.MARKETPLACE_FEATURE})
    void updateFeaturedOffer() throws Exception {

        String requestBody = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/request-update-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/expected-update-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        Offer testOffer = createTestOffer(organisation);
        testOffer.setFeatured(true);
        testOffer.setFeaturedText("Das ist ein wichtiges Angebot.");
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(put(BASE_API_URL + "/" + testOfferWip.getRandomUniqueId(), organisation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    @WithMockWpgwnUser(roles = {PermissionPool.RNE_ADMIN})
    void updateFeaturedOfferWithoutPermission() throws Exception {

        String requestBody = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/request-update-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip.setFeatured(true);
        testOfferWip.setFeaturedText("Das ist ein wichtiges Angebot.");
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(put(BASE_API_URL + "/" + testOfferWip.getRandomUniqueId(), organisation.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteOfferImage() throws Exception {
        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);


        // Test Image Upload
        MockMultipartFile mockfile =
                new MockMultipartFile("file", "testpic.png", MediaType.IMAGE_PNG_VALUE, new byte[20]);
        mockMvc.perform(
                        multipart(HttpMethod.PUT,
                                BASE_API_URL + "/{offerWipId}/image", organisation.getId(), testOfferWip.getRandomUniqueId())
                                .file(mockfile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("filename",
                        Matchers.matchesRegex("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.png$")));
        testOfferWip =
                (OfferWorkInProgress) marketPlaceWorkInProgressRepository.findByRandomUniqueId(testOfferWip.getRandomUniqueId()).orElseThrow();
        assertThat(testOfferWip.getImage()).isNotNull();

        // Test Image Delete
        mockMvc.perform(
                        delete(BASE_API_URL + "/{offerWipId}/image", organisation.getId(), testOfferWip.getRandomUniqueId()))
                .andExpect(status().isNoContent());

        testOfferWip =
                (OfferWorkInProgress) marketPlaceWorkInProgressRepository.findByRandomUniqueId(testOfferWip.getRandomUniqueId()).orElseThrow();
        assertThat(testOfferWip.getImage()).isNull();
    }

    @Test
    @WithMockWpgwnUser(roles = PermissionPool.RNE_ADMIN)
    void releaseOffer() throws Exception {

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/offer_work_in_progress/expected-release-offer-wip.json")
                .getInputStream(), StandardCharsets.UTF_8);

        Offer testOffer = createTestOffer(organisation);
        marketplaceRepository.save(testOffer);

        OfferWorkInProgress testOfferWip = mapper.mapOfferToWorkInProgress(testOffer);
        testOfferWip = marketPlaceWorkInProgressRepository.save(testOfferWip);

        mockMvc.perform(post(BASE_API_URL + "/{offerWipId}/releases", organisation.getId(), testOfferWip.getRandomUniqueId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

}
