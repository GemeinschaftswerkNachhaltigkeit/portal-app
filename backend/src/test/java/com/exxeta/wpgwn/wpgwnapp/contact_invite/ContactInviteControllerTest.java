package com.exxeta.wpgwn.wpgwnapp.contact_invite;

import jakarta.mail.internet.MimeMessage;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.util.NestedServletException;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.exception.EntityExpiredException;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class ContactInviteControllerTest {

    private static final String BASE_API_URL = "/api/v1/contact-invite";
    @Autowired
    private WpgwnProperties wpgwnProperties;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ContactInviteRepository contactInviteRepository;
    @Autowired
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private OrganisationMapper organisationMapper;
    @Autowired
    private Clock clock;
    @MockBean
    private JavaMailSenderImpl javaMailSenderImpl;

    @BeforeEach
    void setup() {
        Mockito.when(javaMailSenderImpl.createMimeMessage()).thenCallRealMethod();
    }

    @AfterEach
    void tearDown() {
        contactInviteRepository.deleteAll();
        organisationWorkInProgressRepository.deleteAll();
        organisationRepository.deleteAll();
    }

    @Test
    void approveContactInvitation1() throws Exception {

        // Given
        Organisation organisation = new Organisation();
        organisationMapper
                .mapWorkInProgressToOrganisationWithoutActivities(MockDataUtils.getOrganisationWorkInProgress(),
                        organisation);
        organisation.setSource(Source.IMPORT);
        organisation.setKeycloakGroupId("KEYCLOAK_ID");
        organisation.setPrivacyConsent(true);
        organisation = organisationRepository.save(organisation);

        ContactInvite contactInvite = getContactInvite();
        contactInvite.setOrganisation(organisation);
        contactInviteRepository.save(contactInvite);

        // When
        mockMvc.perform(put(BASE_API_URL + "/" + contactInvite.getRandomUniqueId() + "?status=ALLOW")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        ContactInvite resultContactInvite =
                contactInviteRepository.findByRandomUniqueId(contactInvite.getRandomUniqueId()).get();
        assertThat(resultContactInvite.getStatus()).isEqualTo(ContactInviteStatus.ALLOW);

        Organisation resultOrganisation = organisationRepository.findById(organisation.getId()).get();
        assertThat(resultOrganisation.getContact().getFirstName()).isEqualTo(contactInvite.getContact().getFirstName());
        assertThat(resultOrganisation.getContact().getLastName()).isEqualTo(contactInvite.getContact().getLastName());
        assertThat(resultOrganisation.getContact().getEmail()).isEqualTo(contactInvite.getContact().getEmail());
    }

    @Test
    void approveContactInvitation2() throws Exception {

        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        ContactInvite contactInvite = getContactInvite();
        contactInvite.setOrganisationWorkInProgress(organisationWorkInProgress);
        contactInviteRepository.save(contactInvite);

        // When
        mockMvc.perform(put(BASE_API_URL + "/" + contactInvite.getRandomUniqueId() + "?status=ALLOW")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        ContactInvite resultContactInvite =
                contactInviteRepository.findByRandomUniqueId(contactInvite.getRandomUniqueId()).get();
        assertThat(resultContactInvite.getStatus()).isEqualTo(ContactInviteStatus.ALLOW);

        OrganisationWorkInProgress resultOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(organisationWorkInProgress.getId()).get();
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getFirstName()).isEqualTo(
                contactInvite.getContact().getFirstName());
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getLastName()).isEqualTo(
                contactInvite.getContact().getLastName());
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getEmail()).isEqualTo(
                contactInvite.getContact().getEmail());
    }

    @Test
    void denyContactInvitation() throws Exception {

        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        ContactInvite contactInvite = getContactInvite();
        contactInvite.setOrganisationWorkInProgress(organisationWorkInProgress);
        contactInviteRepository.save(contactInvite);

        // When
        mockMvc.perform(put(BASE_API_URL + "/" + contactInvite.getRandomUniqueId() + "?status=DENY")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        ContactInvite resultContactInvite =
                contactInviteRepository.findByRandomUniqueId(contactInvite.getRandomUniqueId()).get();
        assertThat(resultContactInvite.getStatus()).isEqualTo(ContactInviteStatus.DENY);

        OrganisationWorkInProgress resultOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(organisationWorkInProgress.getId()).get();
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getFirstName()).isEqualTo(
                organisationWorkInProgress.getContactWorkInProgress().getFirstName());
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getLastName()).isEqualTo(
                organisationWorkInProgress.getContactWorkInProgress().getLastName());
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getEmail()).isEqualTo(
                organisationWorkInProgress.getContactWorkInProgress().getEmail());

        // @ToDo: Template testen wenn fertig
        Mockito.verify(javaMailSenderImpl, Mockito.times(1)).send(Mockito.<MimeMessage>any());
    }

    @Test
    void expiredContactInvitation1() throws Exception {

        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        ContactInvite contactInvite = getContactInvite();
        contactInvite.setOrganisationWorkInProgress(organisationWorkInProgress);
        contactInvite.setExpiresAt(Instant.now(clock).minus(1, ChronoUnit.DAYS));
        contactInviteRepository.save(contactInvite);

        // When
        assertThatThrownBy(() -> {
            try {
                mockMvc.perform(put(BASE_API_URL + "/" + contactInvite.getRandomUniqueId() + "?status=DENY")
                        .contentType(MediaType.APPLICATION_JSON));
            } catch (NestedServletException e) {
                throw e.getCause();
            }
        }).isInstanceOf(EntityExpiredException.class)
                .hasMessage(
                        String.format("[ContactInvite] with uuid [%s] expired!", contactInvite.getRandomUniqueId()));

        OrganisationWorkInProgress resultOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(organisationWorkInProgress.getId()).get();
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getFirstName()).isEqualTo(
                organisationWorkInProgress.getContactWorkInProgress().getFirstName());
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getLastName()).isEqualTo(
                organisationWorkInProgress.getContactWorkInProgress().getLastName());
        assertThat(resultOrganisationWorkInProgress.getContactWorkInProgress().getEmail()).isEqualTo(
                organisationWorkInProgress.getContactWorkInProgress().getEmail());
    }

    private ContactInvite getContactInvite() {
        ContactInvite result = new ContactInvite();
        Contact contact = new Contact();
        result.setContact(contact);
        contact.setFirstName("Tom");
        contact.setLastName("Testreich");
        contact.setEmail("Tom.Testreich@test.exxeta.de");

        result.setEmailSent(false);

        result.setRandomUniqueId(UUID.randomUUID());
        result.setRandomIdGenerationTime(clock.instant());

        result.setExpiresAt(Instant.now(clock).plus(wpgwnProperties.getContactInvite().getExpireFromCreationInDays()));

        result.setStatus(ContactInviteStatus.OPEN);

        return result;
    }

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-08-01T16:22:27.605Z"), ZoneId.of("Europe/Berlin"));
        }
    }
}
