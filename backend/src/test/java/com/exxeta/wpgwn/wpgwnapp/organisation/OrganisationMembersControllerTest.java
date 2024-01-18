package com.exxeta.wpgwn.wpgwnapp.organisation;

import jakarta.mail.Message;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutRepository;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.domain.KeycloakConstants;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.content_generator.OrganisationMembershipExistingUserEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.content_generator.OrganisationMembershipNewUserEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.dto.OrganisationMembershipEmailDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipStatus;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;
import com.exxeta.wpgwn.wpgwnapp.util.MockSecurityUtils;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class OrganisationMembersControllerTest {

    private static final String BASE_API_URL = "/api/v1/organisations";
    @Autowired
    Clock clock;
    @Autowired
    EmailOptOutRepository emailOptOutRepository;
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private OrganisationMembershipRepository organisationMembershipRepository;

    @MockBean
    private KeycloakService keycloakService;

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private EmailProperties emailProperties;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private OrganisationMembershipExistingUserEmailContentGenerator
            organisationMembershipExistingUserEmailContentGenerator;

    @Autowired
    private OrganisationMembershipNewUserEmailContentGenerator organisationMembershipNewUserEmailContentGenerator;

    @Autowired
    private EmailService emailService;
    private GreenMail greenMail;

    @BeforeEach
    void buildUp() {
        greenMail = new GreenMail(
                new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), mailProperties.getProtocol()));
        greenMail.start();
    }

    @AfterEach
    void tearDown() {
        organisationRepository.deleteAll();
        organisationMembershipRepository.deleteAll();
        emailOptOutRepository.deleteAll();
        greenMail.stop();
    }

    /**
     * Erstellen einer Organisations-Mitgliedschaft
     */
    @Test
    @Transactional
    void createOrganisationMembership() throws Exception {

        // Given
        final String invitedUserMail = "invited.user@test.exxeta.com";
        final String keycloakGroupId = "ORG_1_KC_GROUP_ID";

        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(keycloakGroupId);
        organisation = organisationRepository.save(organisation);

        UserRepresentation user = MockDataUtils.getUserRepresentation(invitedUserMail);
        when(keycloakService.getUser(eq(invitedUserMail))).thenReturn(user);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("12345-6789-123456",
                        Map.of(JwtTokenNames.ORGANISATION_ID, organisation.getId(),
                                JwtTokenNames.FIRST_NAME, "Torsten",
                                JwtTokenNames.LAST_NAME, "Testreich"),
                        PermissionPool.MANAGE_ORGANISATION_USERS);

        // When
        mockMvc.perform(post(BASE_API_URL + "/{0}/member", organisation.getId())
                        .with(token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format(
                                "{ \"email\": \"%s\", \"userType\": \"%s\", \"firstName\": \"%s\", \"lastName\": \"%s\"}",
                                invitedUserMail, OrganisationMembershipUserType.MEMBER, "Martin", "Mocknutzer")))

                // Then
                .andExpect(status().isOk());

        List<OrganisationMembership> organisationMemberships =
                organisationMembershipRepository.findAll();

        assertThat(organisationMemberships).hasSize(1);
        assertThat(organisationMemberships.get(0).getEmail()).isEqualTo(invitedUserMail);
        assertThat(organisationMemberships.get(0).getFirstName()).isEqualTo(user.getFirstName());
        assertThat(organisationMemberships.get(0).getLastName()).isEqualTo(user.getLastName());
        assertThat(organisationMemberships.get(0).getOrganisation().getId()).isEqualTo(organisation.getId());
        assertThat(organisationMemberships.get(0).getStatus()).isEqualTo(OrganisationMembershipStatus.OPEN);
        assertThat(organisationMemberships.get(0).getCreatedNewUser()).isFalse();
        assertThat(organisationMemberships.get(0).getExpiresAt())
                .isEqualTo(Instant.now(clock).plus(42, ChronoUnit.DAYS));
    }

    /**
     * Erstellen einer Organisations-Mitgliedschaft
     */
    @Test
    @Transactional
    void testOrganisationMembershipEmailExistingUser() throws Exception {

        // Given
        final String invitedUserMail = "invited.user@test.exxeta.com";
        final String keycloakGroupId = "ORG_1_KC_GROUP_ID";

        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(keycloakGroupId);
        organisation = organisationRepository.save(organisation);

        UserRepresentation user = MockDataUtils.getUserRepresentation(invitedUserMail);
        when(keycloakService.getUser(eq(invitedUserMail))).thenReturn(user);

        OrganisationMembership membership = new OrganisationMembership();
        membership.setRandomUniqueId(UUID.fromString("94eeced5-a8ca-4635-92c8-90cb6790b43b"));
        membership.setRandomIdGenerationTime(Instant.now(clock));
        membership.setOrganisation(organisation);
        membership.setClosedAt(Instant.now(clock));
        membership.setExpiresAt(Instant.now(clock));
        membership.setStatus(OrganisationMembershipStatus.OPEN);
        membership.setUserType(OrganisationMembershipUserType.MEMBER);
        membership.setEmail(invitedUserMail);
        membership.setFirstName("Karl");
        membership.setLastName("Keuchhusten");
        membership.setCreatedNewUser(false);

        // When
        emailService.sendMail(organisationMembershipExistingUserEmailContentGenerator,
                new OrganisationMembershipEmailDto(membership, "Torsten", "Testreich",
                        null));

        // Then
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];
        String fromAddress = "test-from@exxeta.com";
        List<String> allRecipients = List.of("invited.user@test.exxeta.com");
        String testSubject = "Werde Redakteur:in deiner Organisation beim Gemeinschaftswerk Nachhaltigkeit!";
        MailVerifyUtil.verifyRecipients(receivedMessage, allRecipients, Message.RecipientType.TO);
        MailVerifyUtil.verifySubject(receivedMessage, emailProperties.getPrefixForSubject() + testSubject);
        MailVerifyUtil.verifySimpleMail(receivedMessage, new MailVerifyUtil.MailVerifyProperties(
                "classpath:testsamples/organisation/membership/expected-mail-membership-existing-user-invite.html",
                MailVerifyUtil.ContentType.HTML,
                fromAddress,
                allRecipients,
                emailProperties.getPrefixForSubject() + testSubject,
                Collections.emptyList(),
                Map.of("###ORG_ID###", organisation.getId().toString())));
    }

    /**
     * Erstellen einer Organisations-Mitgliedschaft
     */
    @Test
    @Transactional
    void testOrganisationMembershipEmailNewUser() throws Exception {

        // Given
        final String invitedUserMail = "invited.user@test.exxeta.com";
        final String keycloakGroupId = "ORG_1_KC_GROUP_ID";

        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(keycloakGroupId);
        organisation = organisationRepository.save(organisation);

        UserRepresentation user = MockDataUtils.getUserRepresentation(invitedUserMail);
        when(keycloakService.getUser(eq(invitedUserMail))).thenReturn(user);

        OrganisationMembership membership = new OrganisationMembership();
        membership.setRandomUniqueId(UUID.fromString("94eeced5-a8ca-4635-92c8-90cb6790b43b"));
        membership.setRandomIdGenerationTime(Instant.now(clock));
        membership.setOrganisation(organisation);
        membership.setClosedAt(Instant.now(clock));
        membership.setExpiresAt(Instant.now(clock));
        membership.setStatus(OrganisationMembershipStatus.OPEN);
        membership.setUserType(OrganisationMembershipUserType.MEMBER);
        membership.setEmail(invitedUserMail);
        membership.setFirstName("Karl");
        membership.setLastName("Keuchhusten");
        membership.setCreatedNewUser(true);

        // When
        emailService.sendMail(organisationMembershipNewUserEmailContentGenerator,
                new OrganisationMembershipEmailDto(membership, "Torsten", "Testreich",
                        "MY!ONE!TIME!PASSOWRD"));

        // Then
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];
        String fromAddress = "test-from@exxeta.com";
        List<String> allRecipients = List.of("invited.user@test.exxeta.com");
        String testSubject = "Werde Redakteur:in deiner Organisation beim Gemeinschaftswerk Nachhaltigkeit!";
        MailVerifyUtil.verifyRecipients(receivedMessage, allRecipients, Message.RecipientType.TO);
        MailVerifyUtil.verifySubject(receivedMessage, emailProperties.getPrefixForSubject() + testSubject);
        MailVerifyUtil.verifySimpleMail(receivedMessage, new MailVerifyUtil.MailVerifyProperties(
                "classpath:testsamples/organisation/membership/expected-mail-membership-new-user-invite.html",
                MailVerifyUtil.ContentType.HTML,
                fromAddress,
                allRecipients,
                emailProperties.getPrefixForSubject() + testSubject,
                Collections.emptyList(),
                Map.of("###ORG_ID###", organisation.getId().toString())));
    }

    /**
     * Abfragen einer Organisations-Mitgliedschaft
     */
    @Test
    @Transactional
    void getOrganisationMembership() throws Exception {
        // Given
        final String invitedUserMail = "invited.user@test.exxeta.com";
        final String keycloakGroupId = "ORG_1_KC_GROUP_ID";

        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(keycloakGroupId);
        organisation = organisationRepository.save(organisation);

        UserResource userResourceAdmin = mock(UserResource.class);
        when(userResourceAdmin.toRepresentation())
                .thenReturn(MockDataUtils.getUserRepresentation("test_admin@exxeta.com"));
        when(keycloakService.getUserResource(eq("12345-6789-123456")))
                .thenReturn(userResourceAdmin);

        OrganisationMembership membership = new OrganisationMembership();
        membership.setRandomUniqueId(UUID.fromString("94eeced5-a8ca-4635-92c8-90cb6790b43b"));
        membership.setRandomIdGenerationTime(Instant.now(clock));
        membership.setOrganisation(organisation);
        membership.setClosedAt(Instant.now(clock));
        membership.setExpiresAt(Instant.now(clock));
        membership.setStatus(OrganisationMembershipStatus.OPEN);
        membership.setUserType(OrganisationMembershipUserType.MEMBER);
        membership.setEmail(invitedUserMail);
        membership.setFirstName("Karl");
        membership.setLastName("Keuchhusten");
        membership.setCreatedNewUser(false);
        organisationMembershipRepository.save(membership);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("12345-6789-123456",
                        Map.of(JwtTokenNames.ORGANISATION_ID, organisation.getId(),
                                JwtTokenNames.FIRST_NAME, "Torsten",
                                JwtTokenNames.LAST_NAME, "Testreich"),
                        PermissionPool.MANAGE_ORGANISATION_USERS, PermissionPool.OFFER_CHANGE);

        // When
        String expectedResponse = StreamUtils.copyToString(resourceLoader.getResource(
                        "classpath:testsamples/organisation/membership/expected-organisation-membership-response.json")
                .getInputStream(), StandardCharsets.UTF_8);
        mockMvc.perform(get(BASE_API_URL + "/{0}/member", organisation.getId())
                        .accept(MediaType.APPLICATION_JSON).with(token))
                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
    }

    /**
     * Entfernen einer Organisations-Mitgliedschaft
     */
    @Test
    @Transactional
    void deleteOrganisationMembership() throws Exception {
        // Given
        final String invitedUserMail = "invited.user@test.exxeta.com";
        final String keycloakGroupId = "ORG_1_KC_GROUP_ID";

        UserResource userResource = mock(UserResource.class);
        UserRepresentation userRepresentation = MockDataUtils.getUserRepresentation("test@exxeta.com");
        when(userResource.toRepresentation()).thenReturn(userRepresentation);
        when(keycloakService.getUser(any(String.class))).thenReturn(userRepresentation);
        when(keycloakService.getUserResource(any(String.class))).thenReturn(userResource);
        GroupRepresentation group1 = mock(GroupRepresentation.class);
        when(group1.getId()).thenReturn(keycloakGroupId);
        when(userResource.groups()).thenReturn(List.of(group1));

        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(keycloakGroupId);
        organisation = organisationRepository.save(organisation);

        UserResource userResourceAdmin = mock(UserResource.class);
        when(userResourceAdmin.toRepresentation())
                .thenReturn(MockDataUtils.getUserRepresentation("test_admin@exxeta.com"));
        when(keycloakService.getUserResource(eq("12345-6789-123456")))
                .thenReturn(userResourceAdmin);

        OrganisationMembership membership = new OrganisationMembership();
        membership.setRandomUniqueId(UUID.fromString("94eeced5-a8ca-4635-92c8-90cb6790b43b"));
        membership.setRandomIdGenerationTime(Instant.now(clock));
        membership.setOrganisation(organisation);
        membership.setClosedAt(Instant.now(clock));
        membership.setExpiresAt(Instant.now(clock));
        membership.setStatus(OrganisationMembershipStatus.OPEN);
        membership.setUserType(OrganisationMembershipUserType.MEMBER);
        membership.setEmail(invitedUserMail);
        membership.setFirstName("Karl");
        membership.setLastName("Keuchhusten");
        membership.setCreatedNewUser(false);
        organisationMembershipRepository.save(membership);

        UserRepresentation user = MockDataUtils.getUserRepresentation(invitedUserMail);
        user.getAttributes().put(KeycloakConstants.ORGANISATION_ID, new ArrayList<>());
        user.getAttributes()
                .get(KeycloakConstants.ORGANISATION_ID)
                .add(organisation.getId().toString());
        when(keycloakService.getUser(eq(invitedUserMail))).thenReturn(user);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("12345-6789-123456",
                        Map.of(JwtTokenNames.ORGANISATION_ID, organisation.getId(),
                                JwtTokenNames.FIRST_NAME, "Torsten",
                                JwtTokenNames.LAST_NAME, "Testreich"),
                        PermissionPool.MANAGE_ORGANISATION_USERS);

        // When
        mockMvc.perform(delete(BASE_API_URL + "/{0}/member", organisation.getId())
                        .with(token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("{ \"email\": \"%s\", \"userType\": \"%s\"}",
                                invitedUserMail, OrganisationMembershipUserType.MEMBER)))
                // Then
                .andExpect(status().isNoContent());

        Mockito.verify(keycloakService, Mockito.times(1))
                .removeGroupFromUser(eq("1"), eq(keycloakGroupId));

        List<OrganisationMembership> organisationMemberships = organisationMembershipRepository.findAll();
        assertThat(organisationMemberships).isEmpty();
    }

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-09-08T16:22:27.605Z"), ZoneId.of("Europe/Berlin"));
        }
    }
}
