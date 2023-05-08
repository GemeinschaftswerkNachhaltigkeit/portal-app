package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.locationtech.jts.geom.CoordinateXY;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.auditing.AuditingHandler;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutRepository;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.LocationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationType;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class OrganisationWorkInProgressAdminControllerTest {

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-08-01T16:22:27.605Z"), ZoneId.of("Europe/Berlin"));
        }
    }

    private static final String BASE_API_URL = "/api/v1/manage-organisations";
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ResourceLoader resourceLoader;

    @MockBean
    private KeycloakService keycloakService;

    @Autowired
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;

    @Autowired
    private DuplicateCheckService duplicateCheckService;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private FeedbackHistoryEntryRepository feedbackHistoryEntryRepository;

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    Clock clock;

    private DateTimeProvider dateTimeProvider;

    @Autowired
    private AuditingHandler handler;

    @Autowired
    private EmailOptOutRepository emailOptOutRepository;

    private GreenMail greenMail;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    final String toAddress = "test@exxeta.com";
    final String contactAddress = "contactAddress@exxeta.com";

    @BeforeEach
    void setUp() {
        organisationRepository.deleteAll();
        dateTimeProvider = () -> Optional.of(LocalDateTime.ofInstant(Instant.now(clock), ZoneId.systemDefault()));
        handler.setDateTimeProvider(dateTimeProvider);

        greenMail = new GreenMail(new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), "smtp"));
        greenMail.start();
    }

    @AfterEach
    void tearDown() {
        feedbackHistoryEntryRepository.deleteAll();
        organisationRepository.deleteAll();
        organisationWorkInProgressRepository.deleteAll();
        emailOptOutRepository.deleteAll();
        greenMail.stop();
    }

    @WithMockUser(roles = PermissionPool.RNE_ADMIN)
    @Test
    @Transactional
    void sendReminderEmails() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = getOrganisationWorkInProgress();
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        OrganisationWorkInProgress organisationWorkInProgress2 = getOrganisationWorkInProgress();
        organisationWorkInProgress2.setStatus(OrganisationStatus.FREIGABE_VERWEIGERT_CLEARING);
        organisationWorkInProgress2 = organisationWorkInProgressRepository.save(organisationWorkInProgress2);

        OrganisationWorkInProgress savedOrgWip = organisationWorkInProgressRepository
                .findById(organisationWorkInProgress.getId()).get();
        assertThat(savedOrgWip.getEmailNotificationDates()).hasSize(0);

        OrganisationWorkInProgress savedOrgWip2 = organisationWorkInProgressRepository
                .findById(organisationWorkInProgress2.getId()).get();
        assertThat(savedOrgWip2.getEmailNotificationDates()).hasSize(0);

        // When
        mockMvc.perform(post(BASE_API_URL + "/send-reminder-emails")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());
        assertThat(organisationWorkInProgressRepository.count()).isEqualTo(2L);
        assertThat(greenMail.getReceivedMessages()).hasSize(1);

        assertThat(savedOrgWip.getEmailNotificationDates()).hasSize(1);
        assertThat(savedOrgWip2.getEmailNotificationDates()).hasSize(0);
    }

    /**
     * Testet die Veröffentlichung von Organisationen work in progress.
     */
    @WithMockUser(roles = PermissionPool.RNE_ADMIN)
    @Test
    @Transactional
    void publishWorkInProgress() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = getCompleteOrganisationWorkInProgress();
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_GROUP");
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        UserRepresentation user = MockDataUtils.getUserRepresentation(toAddress);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of(user));
        when(keycloakService.getAdminsGroupId(any())).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.getAdminsGroupId(anyString())).thenReturn("123");

        // When
        InputStream inputStream = resourceLoader.getResource(
                        "classpath:/testsamples/organisation-work-in-progress/publish/expected-organisation-response.json")
                .getInputStream();
        String expectedResponse = StreamUtils.copyToString(
                inputStream,
                StandardCharsets.UTF_8);
        mockMvc.perform(post(BASE_API_URL + "/" + organisationWorkInProgress.getId() + "/publish")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
        assertThat(organisationWorkInProgressRepository.count()).isEqualTo(0L);
        assertThat(organisationRepository.count()).isEqualTo(1L);
        assertThat(greenMail.getReceivedMessages()).hasSize(1);
    }

    /**
     * Testet die Veröffentlichung von Organisationen work in progress mit duplikat.
     */
    @WithMockUser(roles = PermissionPool.RNE_ADMIN)
    @Test
    @Transactional
    void publishWorkInProgressWithDuplicate() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = getCompleteOrganisationWorkInProgress();
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        UserRepresentation user = MockDataUtils.getUserRepresentation(toAddress);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of(user));
        when(keycloakService.getAdminsGroupId(any())).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.getAdminsGroupId(anyString())).thenReturn("123");

        // When
        InputStream inputStream = resourceLoader.getResource(
                        "classpath:/testsamples/organisation-work-in-progress/publish/expected-organisation-response.json")
                .getInputStream();
        String expectedResponse = StreamUtils.copyToString(
                inputStream,
                StandardCharsets.UTF_8);
        mockMvc.perform(post(BASE_API_URL + "/" + organisationWorkInProgress.getId() + "/publish")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));

        OrganisationWorkInProgress organisationWorkInProgress2 = getCompleteOrganisationWorkInProgress();
        organisationWorkInProgress2 = organisationWorkInProgressRepository.save(organisationWorkInProgress2);

        DuplicateList duplicateList =
                duplicateCheckService.checkForDuplicate(organisationWorkInProgress2);

        assertThat(duplicateList.getDuplicateListItems()).hasSize(1);

        mockMvc.perform(post(BASE_API_URL + "/" + organisationWorkInProgress2.getId() + "/publish")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse, false));
        assertThat(organisationWorkInProgressRepository.count()).isEqualTo(0L);
        assertThat(organisationRepository.count()).isEqualTo(2L);
        assertThat(greenMail.getReceivedMessages()).hasSize(2);
    }

    /**
     * Testet Rückfragen im Clearing
     */
    @WithMockUser(roles = PermissionPool.RNE_ADMIN)
    @Test
    void feedbackRequiredWorkInProgress() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = getCompleteOrganisationWorkInProgress();
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        // When
        mockMvc.perform(post(BASE_API_URL + "/" + organisationWorkInProgress.getId() + "/require-feedback")
                        .content("{\"feedback\": \"Feedback required now.\"}")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        organisationWorkInProgress =
                organisationWorkInProgressRepository.findById(organisationWorkInProgress.getId()).get();

        assertThat(organisationWorkInProgressRepository.count()).isEqualTo(1L);
        assertThat(greenMail.getReceivedMessages()).hasSize(1);
        assertThat(organisationWorkInProgress.getStatus()).isEqualTo(OrganisationStatus.RUECKFRAGE_CLEARING);
        assertThat(organisationWorkInProgress.getFeedbackRequest()).isEqualTo("Feedback required now.");
        assertThat(organisationWorkInProgress.getFeedbackRequestSent()).isEqualTo(Instant.now(clock));
    }

    @Test
    @WithMockUser(roles = PermissionPool.RNE_ADMIN)
    void rejectWorkInProgress() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = getCompleteOrganisationWorkInProgress();
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        UserRepresentation user = MockDataUtils.getUserRepresentation(toAddress);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of(user));
        when(keycloakService.getAdminsGroupId(any())).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.createAdminGroup(anyString())).thenReturn("123");
        // When
        mockMvc.perform(post(BASE_API_URL + "/" + organisationWorkInProgress.getId() + "/reject")
                        .content("{\"rejectionReason\": \"Die angegebenen Nachhaltigkeitsziele sind nicht nachhaltig genug.\"}")
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        organisationWorkInProgress =
                organisationWorkInProgressRepository.findById(organisationWorkInProgress.getId()).get();

        assertThat(organisationWorkInProgressRepository.count()).isEqualTo(1L);
        assertThat(greenMail.getReceivedMessages()).hasSize(1);
        assertThat(organisationWorkInProgress.getStatus()).isEqualTo(OrganisationStatus.FREIGABE_VERWEIGERT_CLEARING);
        assertThat(organisationWorkInProgress.getRejectionReason()).isEqualTo(
                "Die angegebenen Nachhaltigkeitsziele sind nicht nachhaltig genug.");
    }

    private OrganisationWorkInProgress getOrganisationWorkInProgress() {
        OrganisationWorkInProgress organisationWorkInProgress = new OrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.LANDING_PAGE);
        organisationWorkInProgress.setStatus(OrganisationStatus.NEW);
        organisationWorkInProgress.setPrivacyConsent(true);
        ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        contactWorkInProgress.setEmail("test@exxeta.com");
        organisationWorkInProgress.setContactWorkInProgress(contactWorkInProgress);
        organisationWorkInProgress.setRandomUniqueId(UUID.randomUUID());
        return organisationWorkInProgress;
    }

    private OrganisationWorkInProgress getCompleteOrganisationWorkInProgress() {
        OrganisationWorkInProgress org = getOrganisationWorkInProgress();
        org.setName("Testorganisation");
        org.setDescription("Testorganisationsbeschreibung");
        org.setKeycloakGroupId(UUID.randomUUID().toString());
        org.setSustainableDevelopmentGoals(Set.of(1L, 2L, 3L));
        org.setStatus(OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
        org.setOrganisationType(OrganisationType.EDUCATION);
        org.setImpactArea(ImpactArea.STATE);
        org.setExternalId("1234");
        ContactWorkInProgress contactWorkInProgress = org.getContactWorkInProgress();
        contactWorkInProgress.setFirstName("Maxime Beatrix");
        contactWorkInProgress.setLastName("Musterperson");
        contactWorkInProgress.setPhone("+49 1111 5555");
        contactWorkInProgress.setEmail(contactAddress);

        LocationWorkInProgress locationWorkInProgress = new LocationWorkInProgress();
        locationWorkInProgress.setUrl("http://localhost-test/123");
        locationWorkInProgress.setOnline(true);
        locationWorkInProgress.setCoordinate(geometryFactory.createPoint(new CoordinateXY(1.0, 2.5)));
        org.setLocationWorkInProgress(locationWorkInProgress);

        return org;
    }
}
