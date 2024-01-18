package com.exxeta.wpgwn.wpgwnapp.activity;

import java.nio.charset.StandardCharsets;

import org.hamcrest.text.MatchesPattern;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.StreamUtils;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.CmsClientConfiguration;
import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsClient;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ActivityType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;
import com.exxeta.wpgwn.wpgwnapp.util.MockSecurityUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({CmsClientConfiguration.class, TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class OrganisationActivitiesControllerTest {

    private static final String BASE_API_URL = "/api/v1/organisations/{orgId}/activities";
    @Autowired
    ResourceLoader resourceLoader;
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CmsClient cmsClient;
    @Autowired
    @Qualifier("cmsClientForTest")
    private CmsClient cmsClientTest;
    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityWorkInProgressRepository activityWorkInProgressRepository;

    @AfterEach
    void tearDown() {
        activityWorkInProgressRepository.deleteAll();
        activityRepository.deleteAll();
        organisationRepository.deleteAll();
    }

    @Test
    void findActivitiesForOrganisation() throws Exception {
        // Given
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        Activity activity = MockDataUtils.getActivity();
        activity.setOrganisation(organisation);
        activity.setStatus(ItemStatus.ACTIVE);
        activity.setActivityType(ActivityType.EVENT);
        activityRepository.save(activity);
        when(cmsClient.getFeatures())
                .thenReturn(cmsClientTest.getFeatures());
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/organisation/activities/expected-organisation-activities-response.json")
                .getInputStream(), StandardCharsets.UTF_8);
        String resposne = mockMvc.perform(get(BASE_API_URL, organisation.getId())
                .accept(MediaType.APPLICATION_JSON)).andReturn().getResponse().getContentAsString();
        // When
        mockMvc.perform(get(BASE_API_URL, organisation.getId())
                        .accept(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    @Test
    void updateActivityNoPermissions() throws Exception {
        // When
        mockMvc.perform(put(BASE_API_URL + "/{actId}", 1, 1))
                // Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateActivityWithPermissions() throws Exception {
        // Given
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        Activity activity = MockDataUtils.getActivity();
        activity.setOrganisation(organisation);
        activity = activityRepository.save(activity);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("testuser", organisation.getId(), null,
                        PermissionPool.ACTIVITY_CHANGE);

        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/organisation/activities/expected-organisation-activities-update-response.json")
                .getInputStream(), StandardCharsets.UTF_8);

        // When
        mockMvc.perform(put(BASE_API_URL + "/{actId}", organisation.getId(), activity.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(token))
                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false))
                .andExpect(jsonPath("$.randomUniqueId")
                        .value(MatchesPattern.matchesPattern(
                                "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")));
    }

    @Test
    void setActivityStatus() throws Exception {
        // Given
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        Activity activity = MockDataUtils.getActivity();
        activity.setOrganisation(organisation);
        activity.setStatus(ItemStatus.ACTIVE);
        activity = activityRepository.save(activity);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("testuser", organisation.getId(), null,
                        PermissionPool.ACTIVITY_CHANGE);

        // When
        mockMvc.perform(put(BASE_API_URL + "/{actId}/status", organisation.getId(), activity.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":  \"INACTIVE\"}")
                        .with(token))
                // Then
                .andExpect(status().isOk());

        assertThat(activityRepository.findById(activity.getId()).get().getStatus()).isEqualTo(ItemStatus.INACTIVE);
    }

    @Test
    void deleteActivity() throws Exception {

        // Given
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        Activity activity = MockDataUtils.getActivity();
        activity.setOrganisation(organisation);
        activity.setStatus(ItemStatus.ACTIVE);
        activity = activityRepository.save(activity);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("testuser", organisation.getId(), null,
                        PermissionPool.ACTIVITY_CHANGE);

        // When
        mockMvc.perform(delete(BASE_API_URL + "/{actId}", organisation.getId(), activity.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(token))
                // Then
                .andExpect(status().isNoContent());

        assertThat(activityRepository.findById(activity.getId())).isEmpty();
    }
}
