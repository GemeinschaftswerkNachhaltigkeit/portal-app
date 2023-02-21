package com.exxeta.wpgwn.wpgwnapp.landing_page_initiative.organisation_membership;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipStatus;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.security.WithMockWpgwnUser;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class OrganisationMembersControllerTest {

    private static final String BASE_API_URL = "/api/v1/organisation-membership";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private OrganisationMembershipRepository organisationMembershipRepository;

    @Autowired
    private Clock clock;

    @MockBean
    private KeycloakService keycloakService;

    @BeforeEach
    void setUp() {
        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of());
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.createAdminGroup(anyString())).thenReturn("123");
    }

    @AfterEach
    void tearDown() {
        organisationMembershipRepository.deleteAll();
        organisationRepository.deleteAll();
    }

    @Test
    @Transactional
    @WithMockWpgwnUser(roles = PermissionPool.GUEST)
    void confirmOrganisationMembership() throws Exception {

        final String invitedUserMail = "invited.user@test.exxeta.com";
        final String keycloakGroupId = "ORG_1_KC_GROUP_ID";

        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(keycloakGroupId);
        organisation = organisationRepository.save(organisation);

        UserRepresentation userRepresentation = MockDataUtils.getUserRepresentation(invitedUserMail);

        OrganisationMembership organisationMembership = getOrganisationMembership(organisation);
        organisationMembership.setEmail(invitedUserMail);
        organisationMembership.setFirstName(userRepresentation.getFirstName());
        organisationMembership.setLastName(userRepresentation.getLastName());
        organisationMembership = organisationMembershipRepository.save(organisationMembership);

        // When
        when(keycloakService.getUser(eq(invitedUserMail)))
                .thenReturn(userRepresentation);

        mockMvc.perform(put(BASE_API_URL + "/{0}?status={1}",
                        organisationMembership.getRandomUniqueId(),
                        OrganisationMembershipStatus.ACCEPTED))
                // Then
                .andExpect(status().isOk());

        Mockito.verify(keycloakService, Mockito.times(1))
                .addGroupToUser(eq(userRepresentation.getId()), eq(keycloakGroupId));
        List<OrganisationMembership> organisationMemberships =
                organisationMembershipRepository.findAll();

        assertThat(organisationMemberships).hasSize(1);
        assertThat(organisationMemberships.get(0).getEmail()).isEqualTo(invitedUserMail);
        assertThat(organisationMemberships.get(0).getOrganisation().getId()).isEqualTo(organisation.getId());
        assertThat(organisationMemberships.get(0).getStatus()).isEqualTo(OrganisationMembershipStatus.ACCEPTED);
        assertThat(organisationMemberships.get(0).getClosedAt()).isNotNull();
    }

    private OrganisationMembership getOrganisationMembership(Organisation organisation) {
        OrganisationMembership result = new OrganisationMembership();
        result.setCreatedAt(Instant.now(clock));
        result.setStatus(OrganisationMembershipStatus.OPEN);
        result.setUserType(OrganisationMembershipUserType.MEMBER);
        result.setOrganisation(organisation);
        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(Instant.now(clock));
        result.setCreatedNewUser(false);
        return result;
    }
}
