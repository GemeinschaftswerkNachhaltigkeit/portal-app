package com.exxeta.wpgwn.wpgwnapp.organisation_subscription;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model.OrganisationSubscription;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.security.WithMockWpgwnUser;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class OrganisationSubscriptionControllerTest {


    private static final String BASE_API_URL = "/api/v1/organisation-subscription";
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private OrganisationSubscriptionRepository organisationSubscriptionRepository;

    @AfterEach
    void tearDown() {
        organisationRepository.deleteAll();
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Erwartung: Endet als Erfolgreich erstellte Organisation.
     */
    @Test
    @WithMockWpgwnUser(roles = PermissionPool.GUEST)
    void createAndDeleteOrganisationSubscription() throws Exception {

        Organisation organisation = callCreateOrganisationSubscription();

        List<OrganisationSubscription> organisationSubscriptions =
                organisationSubscriptionRepository.findAll();

        assertThat(organisationSubscriptions).hasSize(1);
        assertThat(organisationSubscriptions.get(0).getSubscribedUserId()).isEqualTo("12345-6789-123456");
        assertThat(organisationSubscriptions.get(0).getOrganisation().getId()).isEqualTo(organisation.getId());


        // When
        mockMvc.perform(delete(BASE_API_URL + "/" + organisationSubscriptions.get(0).getId()))
                // Then
                .andExpect(status().isOk());

        organisationSubscriptions =
                organisationSubscriptionRepository.findAll();

        assertThat(organisationSubscriptions).isEmpty();
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Erwartung: Endet als Erfolgreich erstellte Organisation.
     */
    @Test
    @WithMockWpgwnUser(roles = PermissionPool.GUEST)
    void createAndDeleteOrganisationSubscriptionByOrgId() throws Exception {

        Organisation organisation = callCreateOrganisationSubscription();

        List<OrganisationSubscription> organisationSubscriptions =
                organisationSubscriptionRepository.findAll();

        assertThat(organisationSubscriptions).hasSize(1);
        assertThat(organisationSubscriptions.get(0).getSubscribedUserId()).isEqualTo("12345-6789-123456");
        assertThat(organisationSubscriptions.get(0).getOrganisation().getId()).isEqualTo(organisation.getId());


        // When
        mockMvc.perform(delete(BASE_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"organisationId\": " + organisation.getId() + "}"))
                // Then
                .andExpect(status().isOk());

        organisationSubscriptions =
                organisationSubscriptionRepository.findAll();

        assertThat(organisationSubscriptions).isEmpty();
    }

    @Test
    public void testGetForUnauthenticated() throws Exception {

        // When
        mockMvc.perform(get(BASE_API_URL))
                // Then
                .andExpect(status().isUnauthorized());
    }

    private Organisation callCreateOrganisationSubscription() throws Exception {
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation = organisationRepository.save(organisation);

        // When
        mockMvc.perform(post(BASE_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"organisationId\": " + organisation.getId() + "}")
                        .accept(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(status().isOk());

        return organisation;
    }
}
