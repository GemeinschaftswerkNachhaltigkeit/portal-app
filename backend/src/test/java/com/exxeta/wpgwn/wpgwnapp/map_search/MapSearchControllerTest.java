package com.exxeta.wpgwn.wpgwnapp.map_search;


import com.exxeta.wpgwn.wpgwnapp.CmsClientConfiguration;
import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsClient;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDataDto;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.*;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import com.google.common.collect.Lists;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

import static com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService.DAN_ACCOUNT_KEY;
import static com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService.DAN_RANGE_KEY;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({CmsClientConfiguration.class, TestSecurityConfiguration.class})
@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class MapSearchControllerTest {

    private static final String BASE_API_URL = "/api/v1/search";

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-09-08T00:00:00.000Z"), ZoneId.of("Europe/Berlin"));
        }
    }

    @Autowired
    private Clock clock;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private MapSearchResultRepository mapSearchResultRepository;

    @MockBean
    private CmsClient cmsClient;

    @Autowired
    @Qualifier("cmsClientForTest")
    private CmsClient cmsClientTest;


    @BeforeEach
    public void setUp() {
        List<Organisation> orgs = new ArrayList<>();
        List<Activity> acts = new ArrayList<>();

        Instant instant = Instant.now(clock);

        IntStream.range(0, 10).forEach(i -> {
            Organisation org = MockDataUtils.getOrganisation();
            org.setName(String.format("TEST_ORG_%03d", i));

            if (i < 5) {
                org.setOrganisationType(OrganisationType.EDUCATION);
                org.setThematicFocus(Set.of(ThematicFocus.EDUCATION));
                org.setSustainableDevelopmentGoals(Set.of(1L, 2L));
                org.setImpactArea(ImpactArea.LOCAL);
            } else {
                org.setOrganisationType(OrganisationType.BUSINESS);
                org.setThematicFocus(Set.of(ThematicFocus.SOCIAL_JUSTICE));
                org.setSustainableDevelopmentGoals(Set.of(5L, 6L));
                org.setImpactArea(ImpactArea.WORLD);
            }
            if (i == 3) {
                org.getLocation().getAddress().setCity("Dresden");
                org.setOrganisationType(OrganisationType.CULTURAL);
                org.setThematicFocus(Set.of(ThematicFocus.CULTURAL_SOCIAL_CHANGE, ThematicFocus.PEACE));
                org.setSustainableDevelopmentGoals(Set.of(3L, 4L));
                org.setImpactArea(ImpactArea.REGIONAL);
            }

            org.setCreatedAt(instant.plusSeconds(i));
            org.setModifiedAt(instant.plusSeconds(i));

            if (i % 2 == 0) {
                org.setInitiator(true);
                org.setProjectSustainabilityWinner(false);
            } else {
                org.setInitiator(false);
                org.setProjectSustainabilityWinner(true);
            }

            Activity act = MockDataUtils.getActivity();
            act.setName(String.format("TEST_ACT_%03d", i));
            if (i < 5) {
                Period period = new Period();
                period.setStart(getNowPlusDays(0));
                period.setEnd(getNowPlusDays(5));

                act.setPeriod(period);
                act.setActivityType(ActivityType.EVENT);
                act.setThematicFocus(Set.of(ThematicFocus.EDUCATION));
                act.setSustainableDevelopmentGoals(Set.of(1L, 2L));
                act.setImpactArea(ImpactArea.LOCAL);
            } else {
                Period period = new Period();
                period.setStart(getNowPlusDays(-5));
                period.setEnd(getNowPlusDays(-1));

                act.setPeriod(period);
                act.setActivityType(ActivityType.DAN
                );
                act.setThematicFocus(Set.of(ThematicFocus.SOCIAL_JUSTICE));
                act.setSustainableDevelopmentGoals(Set.of(5L, 6L));
                act.setImpactArea(ImpactArea.WORLD);
            }
            if (i == 2) {
                act.setDescription("DESC TEST 007");

                Period period = new Period();
                period.setStart(getNowPlusDays(3));
                period.setEnd(getNowPlusDays(5));

                act.setPeriod(period);
                act.getLocation().getAddress().setCity("Dresden");
                act.setThematicFocus(Set.of(ThematicFocus.CULTURAL_SOCIAL_CHANGE, ThematicFocus.PEACE));
                act.setSustainableDevelopmentGoals(Set.of(3L, 4L));
                act.setImpactArea(ImpactArea.REGIONAL);
            }
            if (i == 4) {
                Period period = new Period();
                period.setStart(Instant.parse("1970-01-01T00:00:00Z"));
                period.setEnd(Instant.parse("9999-12-31T00:00:00Z"));

                act.setPeriod(period);
            }

            if (i == 3) {
                act.getLocation().setOnline(true);
            }

            act.setOrganisation(org);

            act.setCreatedAt(instant.plusSeconds(20 + i));
            act.setModifiedAt(instant.plusSeconds(20 + i));

            orgs.add(org);
            acts.add(act);
        });

        organisationRepository.saveAll(orgs);
        activityRepository.saveAll(acts);

        mapSearchResultRepository.refreshView();

    }

    @AfterEach
    public void tearDown() {
        organisationRepository.deleteAll();
        activityRepository.deleteAll();
    }

    @Test
    void requestAll() throws Exception {
        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        log.info("requestAll {}", responseString);
        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("20");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("20");
    }

    @Test
    void requestOrganisations() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ORGANISATION")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("10");
    }

    @Test
    void requestOrganisationsAndDanWithInactiveDanSetting() throws Exception {
        inactiveDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ORGANISATION", "DAN")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("10");
    }

    @Test
    void requestOrganisationsAndDan() throws Exception {
        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ORGANISATION", "DAN")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("15");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("15");
    }

    @Test
    void requestEvent() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ACTIVITY")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("5");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("5");
    }

    @Test
    void requestDan() throws Exception {
        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "DAN")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("5");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("5");
    }

    @Test
    void requestDanAndEvent() throws Exception {
        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "DAN", "ACTIVITY")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("10");
    }

    @Test
    void requestDanAndEventWithInactiveDanSetting() throws Exception {
        inactiveDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "DAN", "ACTIVITY")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("5");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("5");
    }

    @Test
    void requestPermanentActivities() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ACTIVITY")
                        .queryParam("permanent", "true")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("1");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("1");
    }


    @Test
    void requestNotPermanentActivities() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ACTIVITY")
                        .queryParam("permanent", "false")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("4");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("4");
    }

    @Test
    void requestOnlineActivities() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ACTIVITY")
                        .queryParam("online", "true")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("1");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("1");
    }

    @Test
    void requestNotOnlineActivities() throws Exception {

        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ACTIVITY")
                        .queryParam("online", "false")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("4");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("4");
    }

    @Test
    void requestPaged() throws Exception {

        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "DAN", "ORGANISATION")
                        .queryParam("page", "1")
                        .queryParam("size", "10")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("5");
        assertThat(jsonResponse.read("$['content'][0]['resultType']").toString()).isEqualTo("DAN");
        assertThat(jsonResponse.read("$['content'][1]['resultType']").toString()).isEqualTo("ORGANISATION");
        assertThat(jsonResponse.read("$['content'][2]['resultType']").toString()).isEqualTo("ORGANISATION");
        assertThat(jsonResponse.read("$['content'][3]['resultType']").toString()).isEqualTo("ORGANISATION");
        assertThat(jsonResponse.read("$['content'][4]['resultType']").toString()).isEqualTo("ORGANISATION");
        assertThat(jsonResponse.read("$['totalElements']").toString()).isEqualTo("15");
        assertThat(jsonResponse.read("$['first']").toString()).isEqualTo("false");
        assertThat(jsonResponse.read("$['last']").toString()).isEqualTo("true");
        assertThat(jsonResponse.read("$['number']").toString()).isEqualTo("1");
    }

    @Test
    void requestQuery() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("query", "007")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("2");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ORG_007");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ACT_002");
    }

    @Test
    void requestLocation() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("location", "Dresden")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("2");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ORG_003");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ACT_002");
    }

    @Test
    void requestOrgType() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("resultType", "ORGANISATION")
                        .queryParam("organisationType", OrganisationType.EDUCATION.name(),
                                OrganisationType.CULTURAL.name())
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("5");
        assertThat(jsonResponse.read("$['content'][4]['name']").toString()).isEqualTo("TEST_ORG_000");
        assertThat(jsonResponse.read("$['content'][3]['name']").toString()).isEqualTo("TEST_ORG_001");
        assertThat(jsonResponse.read("$['content'][2]['name']").toString()).isEqualTo("TEST_ORG_002");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ORG_003");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ORG_004");
    }

    @Test
    void requestActType() throws Exception {
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("activityTypes", ActivityType.EVENT.name())
                        .queryParam("resultType", "ACTIVITY")
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("5");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ACT_004");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ACT_003");
        assertThat(jsonResponse.read("$['content'][2]['name']").toString()).isEqualTo("TEST_ACT_002");
        assertThat(jsonResponse.read("$['content'][3]['name']").toString()).isEqualTo("TEST_ACT_001");
        assertThat(jsonResponse.read("$['content'][4]['name']").toString()).isEqualTo("TEST_ACT_000");
    }

    @Test
    void requestDanAndOrgType() throws Exception {
        activeDanSetting();
        MockHttpServletRequestBuilder getRequestBuilder = get(BASE_API_URL)
                .queryParam("organisationType", OrganisationType.EDUCATION.name(), OrganisationType.CULTURAL.name())
                .queryParam("resultType", "DAN", "ORGANISATION")
                .queryParam("includeExpiredActivities", "true")
                .contentType(MediaType.APPLICATION_JSON);
        MockHttpServletRequest getRequest =
                getRequestBuilder.buildRequest(mockMvc.getDispatcherServlet().getServletContext());
        log.info("requestActTypeAndOrgType: perform request: " + getRequest.getRequestURL() + "?" +
                getRequest.getQueryString());

        // When
        String responseString = mockMvc.perform(getRequestBuilder)

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        log.info("requestActTypeAndOrgType: check result");
        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['content'][9]['name']").toString()).isEqualTo("TEST_ORG_000");
        assertThat(jsonResponse.read("$['content'][8]['name']").toString()).isEqualTo("TEST_ORG_001");
        assertThat(jsonResponse.read("$['content'][7]['name']").toString()).isEqualTo("TEST_ORG_002");
        assertThat(jsonResponse.read("$['content'][6]['name']").toString()).isEqualTo("TEST_ORG_003");
        assertThat(jsonResponse.read("$['content'][5]['name']").toString()).isEqualTo("TEST_ACT_005");
        assertThat(jsonResponse.read("$['content'][4]['name']").toString()).isEqualTo("TEST_ORG_004");
        assertThat(jsonResponse.read("$['content'][3]['name']").toString()).isEqualTo("TEST_ACT_006");
        assertThat(jsonResponse.read("$['content'][2]['name']").toString()).isEqualTo("TEST_ACT_007");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ACT_008");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ACT_009");
    }

    @Test
    void requestThematicFocus() throws Exception {
        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("thematicFocus", ThematicFocus.EDUCATION.name(), ThematicFocus.PEACE.name())
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['content'][9]['name']").toString()).isEqualTo("TEST_ORG_000");
        assertThat(jsonResponse.read("$['content'][8]['name']").toString()).isEqualTo("TEST_ORG_001");
        assertThat(jsonResponse.read("$['content'][7]['name']").toString()).isEqualTo("TEST_ORG_002");
        assertThat(jsonResponse.read("$['content'][6]['name']").toString()).isEqualTo("TEST_ORG_003");
        assertThat(jsonResponse.read("$['content'][5]['name']").toString()).isEqualTo("TEST_ACT_000");
        assertThat(jsonResponse.read("$['content'][4]['name']").toString()).isEqualTo("TEST_ORG_004");
        assertThat(jsonResponse.read("$['content'][3]['name']").toString()).isEqualTo("TEST_ACT_001");
        assertThat(jsonResponse.read("$['content'][2]['name']").toString()).isEqualTo("TEST_ACT_002");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ACT_003");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ACT_004");
    }

    @Test
    void requestSustainableDevelopmentGoals() throws Exception {
        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("sustainableDevelopmentGoals", "1", "3")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['content'][9]['name']").toString()).isEqualTo("TEST_ORG_000");
        assertThat(jsonResponse.read("$['content'][8]['name']").toString()).isEqualTo("TEST_ORG_001");
        assertThat(jsonResponse.read("$['content'][7]['name']").toString()).isEqualTo("TEST_ORG_002");
        assertThat(jsonResponse.read("$['content'][6]['name']").toString()).isEqualTo("TEST_ORG_003");
        assertThat(jsonResponse.read("$['content'][5]['name']").toString()).isEqualTo("TEST_ACT_000");
        assertThat(jsonResponse.read("$['content'][4]['name']").toString()).isEqualTo("TEST_ORG_004");
        assertThat(jsonResponse.read("$['content'][3]['name']").toString()).isEqualTo("TEST_ACT_001");
        assertThat(jsonResponse.read("$['content'][2]['name']").toString()).isEqualTo("TEST_ACT_002");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ACT_003");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ACT_004");
    }

    @Test
    void requestImpactArea() throws Exception {

        activeDanSetting();
        // When
        String responseString = mockMvc.perform(get(BASE_API_URL)
                        .queryParam("impactArea", ImpactArea.LOCAL.name(),
                                ImpactArea.REGIONAL.name())
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Use JsonPath to Check because cant create Page and MapSearchResultWrapperDto through ObjectMapper
        DocumentContext jsonResponse = JsonPath.parse(responseString);
        assertThat(jsonResponse.read("$['numberOfElements']").toString()).isEqualTo("10");
        assertThat(jsonResponse.read("$['content'][9]['name']").toString()).isEqualTo("TEST_ORG_000");
        assertThat(jsonResponse.read("$['content'][8]['name']").toString()).isEqualTo("TEST_ORG_001");
        assertThat(jsonResponse.read("$['content'][7]['name']").toString()).isEqualTo("TEST_ORG_002");
        assertThat(jsonResponse.read("$['content'][6]['name']").toString()).isEqualTo("TEST_ORG_003");
        assertThat(jsonResponse.read("$['content'][5]['name']").toString()).isEqualTo("TEST_ACT_000");
        assertThat(jsonResponse.read("$['content'][4]['name']").toString()).isEqualTo("TEST_ORG_004");
        assertThat(jsonResponse.read("$['content'][3]['name']").toString()).isEqualTo("TEST_ACT_001");
        assertThat(jsonResponse.read("$['content'][2]['name']").toString()).isEqualTo("TEST_ACT_002");
        assertThat(jsonResponse.read("$['content'][1]['name']").toString()).isEqualTo("TEST_ACT_003");
        assertThat(jsonResponse.read("$['content'][0]['name']").toString()).isEqualTo("TEST_ACT_004");
    }

    @Test
    void requestPeriod_1() throws Exception {
        activeDanSetting();
        // When
        String startDate = getStringForNowPlusDays(0);
        String endDate = getStringForNowPlusDays(9);
        ResultActions resultActions = mockMvc.perform(get(BASE_API_URL)
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
                .contentType(MediaType.APPLICATION_JSON));
        // Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("14"))
                .andExpect(jsonPath("$['content'][13]['name']").value("TEST_ORG_000"))
                .andExpect(jsonPath("$['content'][12]['name']").value("TEST_ORG_001"))
                .andExpect(jsonPath("$['content'][11]['name']").value("TEST_ORG_002"))
                .andExpect(jsonPath("$['content'][10]['name']").value("TEST_ORG_003"))
                .andExpect(jsonPath("$['content'][9]['name']").value("TEST_ACT_000"))
                .andExpect(jsonPath("$['content'][8]['name']").value("TEST_ORG_004"))
                .andExpect(jsonPath("$['content'][7]['name']").value("TEST_ORG_005"))
                .andExpect(jsonPath("$['content'][6]['name']").value("TEST_ACT_001"))
                .andExpect(jsonPath("$['content'][5]['name']").value("TEST_ACT_002"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_006"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_007"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ACT_003"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_008"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_009"));
    }

    @Test
    void requestPeriod_2() throws Exception {
        activeDanSetting();
        // When
        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("startDate", getStringForNowPlusDays(-6))
                        .queryParam("endDate", getStringForNowPlusDays(5))
                        .queryParam("includeExpiredActivities", "true")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("19"))
                .andExpect(jsonPath("$['content'][18]['name']").value("TEST_ORG_000"))
                .andExpect(jsonPath("$['content'][17]['name']").value("TEST_ORG_001"))
                .andExpect(jsonPath("$['content'][16]['name']").value("TEST_ORG_002"))
                .andExpect(jsonPath("$['content'][15]['name']").value("TEST_ORG_003"))
                .andExpect(jsonPath("$['content'][14]['name']").value("TEST_ACT_005"))
                .andExpect(jsonPath("$['content'][13]['name']").value("TEST_ACT_000"))
                .andExpect(jsonPath("$['content'][12]['name']").value("TEST_ORG_004"))
                .andExpect(jsonPath("$['content'][11]['name']").value("TEST_ORG_005"))
                .andExpect(jsonPath("$['content'][10]['name']").value("TEST_ACT_006"))
                .andExpect(jsonPath("$['content'][9]['name']").value("TEST_ACT_007"))
                .andExpect(jsonPath("$['content'][8]['name']").value("TEST_ACT_001"))
                .andExpect(jsonPath("$['content'][7]['name']").value("TEST_ACT_002"))
                .andExpect(jsonPath("$['content'][6]['name']").value("TEST_ORG_006"))
                .andExpect(jsonPath("$['content'][5]['name']").value("TEST_ORG_007"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ACT_008"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ACT_009"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ACT_003"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_008"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_009"));
    }

    @Test
    void requestPeriod_3() throws Exception {
        activeDanSetting();
        // When
        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("startDate", getStringForNowPlusDays(3))
                        .queryParam("endDate", getStringForNowPlusDays(5))
                        .queryParam("resultType", "ACTIVITY")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("1"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ACT_002"));

    }

    @Test
    void requestPeriod_4() throws Exception {
        activeDanSetting();
        // When
        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("startDate", "9999-12-31T00:00:00Z")
                        .queryParam("endDate", "1970-01-01T00:00:00Z")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("10"))
                .andExpect(jsonPath("$['content'][9]['name']").value("TEST_ORG_000"))
                .andExpect(jsonPath("$['content'][8]['name']").value("TEST_ORG_001"))
                .andExpect(jsonPath("$['content'][7]['name']").value("TEST_ORG_002"))
                .andExpect(jsonPath("$['content'][6]['name']").value("TEST_ORG_003"))
                .andExpect(jsonPath("$['content'][5]['name']").value("TEST_ORG_004"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_005"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_006"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ORG_007"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_008"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_009"));
    }

    @Test
    void requestProjectSustainabilityWinner() throws Exception {
        activeDanSetting();

        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("projectSustainabilityWinner", "true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("5"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_001"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_003"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ORG_005"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_007"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_009"));
    }

    @Test
    void requestInitiator() throws Exception {

        activeDanSetting();

        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("initiator", "true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("5"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_000"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_002"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ORG_004"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_006"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_008"));
    }

    @Test
    void requestProjectSustainabilityWinnerInactive() throws Exception {

        activeDanSetting();

        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("projectSustainabilityWinner", "false")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("5"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_000"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_002"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ORG_004"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_006"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_008"));
    }

    @Test
    void requestInitiatorInactive() throws Exception {

        activeDanSetting();

        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("initiator", "false")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("5"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_001"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_003"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ORG_005"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_007"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_009"));
    }

    @Test
    void requestProjectSustainabilityWinnerAndInitiator() throws Exception {

        activeDanSetting();

        mockMvc.perform(get(BASE_API_URL)
                        .queryParam("projectSustainabilityWinner", "true")
                        .queryParam("initiator", "true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['numberOfElements']").value("10"))
                .andExpect(jsonPath("$['content'][9]['name']").value("TEST_ORG_000"))
                .andExpect(jsonPath("$['content'][8]['name']").value("TEST_ORG_001"))
                .andExpect(jsonPath("$['content'][7]['name']").value("TEST_ORG_002"))
                .andExpect(jsonPath("$['content'][6]['name']").value("TEST_ORG_003"))
                .andExpect(jsonPath("$['content'][5]['name']").value("TEST_ORG_004"))
                .andExpect(jsonPath("$['content'][4]['name']").value("TEST_ORG_005"))
                .andExpect(jsonPath("$['content'][3]['name']").value("TEST_ORG_006"))
                .andExpect(jsonPath("$['content'][2]['name']").value("TEST_ORG_007"))
                .andExpect(jsonPath("$['content'][1]['name']").value("TEST_ORG_008"))
                .andExpect(jsonPath("$['content'][0]['name']").value("TEST_ORG_009"));
    }

    private String getStringForNowPlusDays(Integer days) {
        return getNowPlusDays(days).toString();
    }

    private Instant getNowPlusDays(Integer days) {
        return Instant.now(clock)
                .plus(days, ChronoUnit.DAYS);
    }


    private void activeDanSetting() {
        when(cmsClient.getFeatures())
                .thenReturn(getActiveFeatures());
    }

    private void inactiveDanSetting() {
        when(cmsClient.getFeatures())
                .thenReturn(getInactiveFeatures());
    }


    public FeatureDataDto getActiveFeatures() {
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

    public FeatureDataDto getInactiveFeatures() {
        FeatureDto danAccount = FeatureDto.builder().feature(DAN_ACCOUNT_KEY)
                .active(false)
                .start(LocalDateTime.now(clock).minusYears(1))
                .end(LocalDateTime.now(clock).plusYears(1)).build();
        FeatureDto danRange = FeatureDto.builder().feature(DAN_RANGE_KEY)
                .active(false)
                .start(LocalDateTime.now(clock).minusYears(1))
                .end(LocalDateTime.now(clock).plusYears(1)).build();
        FeatureDataDto featureDataDto = new FeatureDataDto();
        featureDataDto.setData(Lists.newArrayList(danAccount, danRange));

        return featureDataDto;
    }

}
