package com.exxeta.wpgwn.wpgwnapp.activity_subscription;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.model.ActivitySubscription;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;
import com.exxeta.wpgwn.wpgwnapp.util.MockSecurityUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class ActivitySubscriptionControllerTest {


    private static final String BASE_API_URL = "/api/v1/activity-subscription";
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivitySubscriptionRepository activitySubscriptionRepository;

    @AfterEach
    void tearDown() {
        organisationRepository.deleteAll();
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Erwartung: Endet als Erfolgreich erstellte Organisation.
     */
    @Test
    void createAndDeleteActivitySubscription() throws Exception {


        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("testuser", null, PermissionPool.GUEST);

        Activity activity = callCreateActivitySubscription(token);

        List<ActivitySubscription> activitySubscriptions =
                activitySubscriptionRepository.findAll();

        assertThat(activitySubscriptions).hasSize(1);
        assertThat(activitySubscriptions.get(0).getSubscribedUserId()).isEqualTo("testuser");
        assertThat(activitySubscriptions.get(0).getActivity().getId()).isEqualTo(activity.getId());


        // When
        mockMvc.perform(delete(BASE_API_URL + "/" + activitySubscriptions.get(0).getId())
                        .with(token))
                // Then
                .andExpect(status().isOk());

        activitySubscriptions =
                activitySubscriptionRepository.findAll();

        assertThat(activitySubscriptions).isEmpty();
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Erwartung: Endet als Erfolgreich erstellte Organisation.
     */
    @Test
    void createAndDeleteActivitySubscriptionByActivityId() throws Exception {

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("testuser", null, PermissionPool.GUEST);

        Activity activity = callCreateActivitySubscription(token);

        List<ActivitySubscription> activitySubscriptions =
                activitySubscriptionRepository.findAll();

        assertThat(activitySubscriptions).hasSize(1);
        assertThat(activitySubscriptions.get(0).getSubscribedUserId()).isEqualTo("testuser");
        assertThat(activitySubscriptions.get(0).getActivity().getId()).isEqualTo(activity.getId());


        // When
        mockMvc.perform(delete(BASE_API_URL + "/" + activitySubscriptions.get(0).getId())
                        .with(token))
                // Then
                .andExpect(status().isOk());

        activitySubscriptions =
                activitySubscriptionRepository.findAll();

        assertThat(activitySubscriptions).isEmpty();
    }

    @Test
    public void testGetForUnauthenticated() throws Exception {

        // When
        mockMvc.perform(get(BASE_API_URL))
                // Then
                .andExpect(status().isUnauthorized());
    }

    private Activity callCreateActivitySubscription(
            SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token) throws Exception {
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        Activity activity = MockDataUtils.getActivity();
        activity.setOrganisation(organisation);
        activity = activityRepository.save(activity);

        // When
        mockMvc.perform(post(BASE_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"activityId\": " + activity.getId() + "}")
                        .accept(MediaType.APPLICATION_JSON)
                        .with(token))
                // Then
                .andExpect(status().isOk());

        return activity;
    }

}
