package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import javax.mail.internet.MimeMessage;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInvite;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteRepository;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteStatus;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateListRepository;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutRepository;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;
import com.exxeta.wpgwn.wpgwnapp.util.MockSecurityUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class OrganisationWorkInProgressControllerTest {

    private static final String BASE_API_URL = "/api/v1/register-organisation";
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private DuplicateListRepository duplicateListRepository;
    @Autowired
    private ContactInviteRepository contactInviteRepository;
    @Autowired
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    @Autowired
    private ActivityWorkInProgressRepository activityWorkInProgressRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private EmailOptOutRepository emailOptOutRepository;
    @MockBean
    private KeycloakService keycloakService;
    @MockBean
    private JavaMailSenderImpl javaMailSenderImpl;
    @Autowired
    private Clock clock;

    @BeforeEach
    void setup() {
        when(javaMailSenderImpl.createMimeMessage()).thenCallRealMethod();
    }

    @BeforeEach
    void buildUp() {
        organisationRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        duplicateListRepository.deleteAll();
        contactInviteRepository.deleteAll();
        organisationWorkInProgressRepository.deleteAll();
        organisationRepository.deleteAll();
        emailOptOutRepository.deleteAll();
    }

    /**
     * Ablehnung der Mitmacherklärung.
     */
    @Test
    void denyPolicyConsent() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setStatus(OrganisationStatus.PRIVACY_CONSENT_REQUIRED);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        // When
        mockMvc.perform(
                        post(BASE_API_URL + "/" + organisationWorkInProgress.getRandomUniqueId() + "/deny-privacy-policy")
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        OrganisationWorkInProgress savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id).get();

        assertThat(savedOrganisationWorkInProgress.getStatus())
                .isEqualTo(OrganisationStatus.FREIGABE_VERWEIGERT_KONTAKT_INITIATIVE);
        assertThat(savedOrganisationWorkInProgress.getPrivacyConsent()).isEqualTo(false);
    }

    /**
     * Akzeptieren der Mitmacherklärung.
     */
    @Test
    void acceptPolicyConsent() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setStatus(OrganisationStatus.PRIVACY_CONSENT_REQUIRED);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        // When
        mockMvc.perform(post(BASE_API_URL + "/{0}/accept-privacy-policy",
                        organisationWorkInProgress.getRandomUniqueId())
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        OrganisationWorkInProgress savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id).get();

        assertThat(savedOrganisationWorkInProgress.getStatus()).isEqualTo(OrganisationStatus.NEW);
        assertThat(savedOrganisationWorkInProgress.getPrivacyConsent()).isEqualTo(true);
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Erwartung: Endet als Erfolgreich erstellte Organisation.
     */
    @Test
    void submitOrganisationWorkInProgressForApproval1() throws Exception {
        initKeycloakUser();

        // Given
        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of());
        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.getFirstUserWithEmailInGroup(anyString())).thenReturn(Optional.of("u-1"));

        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        when(keycloakService.findGroupIdFor(any())).thenReturn(Optional.of("KEYCLOAK_ID"));
        UserRepresentation user = new UserRepresentation();
        user.setFirstName(organisationWorkInProgress.getContactWorkInProgress().getFirstName());
        user.setLastName(organisationWorkInProgress.getContactWorkInProgress().getLastName());
        user.setEmail(organisationWorkInProgress.getContactWorkInProgress().getEmail());
        initKeycloakUser(user);

        OrganisationWorkInProgress finalOrganisationWorkInProgress = organisationWorkInProgress;
        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(null, null,
                        finalOrganisationWorkInProgress.getId(), PermissionPool.ORGANISATION_PUBLISH);

        // When
        mockMvc.perform(post(BASE_API_URL + "/{0}/releases", organisationWorkInProgress.getRandomUniqueId())
                        .with(token)
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        Optional<OrganisationWorkInProgress> savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id);
        List<Organisation> organisations =
                organisationRepository.findAll();

        assertThat(savedOrganisationWorkInProgress.isPresent()).isFalse();
        assertThat(organisations).hasSize(1);
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, von LandingPage.
     * Erwartung: Endet als Organisation (WIP) im Status FREIGABE_KONTAKT_ORGANISATION.
     */
    @Test
    @WithMockUser(roles = PermissionPool.GUEST)
    void submitOrganisationWorkInProgressForApproval2() throws Exception {

        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.LANDING_PAGE);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getFirstUserWithEmailInGroup(anyString())).thenReturn(Optional.of("u-1"));
        UserRepresentation user = new UserRepresentation();
        user.setFirstName(organisationWorkInProgress.getContactWorkInProgress().getFirstName());
        user.setLastName(organisationWorkInProgress.getContactWorkInProgress().getLastName());
        user.setEmail(organisationWorkInProgress.getContactWorkInProgress().getEmail());
        initKeycloakUser(user);

        OrganisationWorkInProgress finalOrganisationWorkInProgress = organisationWorkInProgress;
        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(null, null,
                        finalOrganisationWorkInProgress.getId(), PermissionPool.ORGANISATION_PUBLISH);

        // When
        mockMvc.perform(
                        post(BASE_API_URL + "/{0}/releases", organisationWorkInProgress.getRandomUniqueId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        Optional<OrganisationWorkInProgress> savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id);
        List<Organisation> organisations =
                organisationRepository.findAll();

        assertThat(savedOrganisationWorkInProgress.isPresent()).isTrue();
        assertThat(savedOrganisationWorkInProgress.get().getStatus())
                .isEqualTo(OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
        assertThat(organisations).hasSize(0);
    }

    /**
     * Organisation zur Bestätigung einreichen. Duplikat gefunden.
     * Erwartung: Endet als Organisation (WIP) im Status FREIGABE_KONTAKT_ORGANISATION und Duplikate gefunden
     */
    @WithMockUser(roles = PermissionPool.GUEST)
    @Test
    void submitOrganisationWorkInProgressForApproval3() throws Exception {

        // Given
        OrganisationWorkInProgress organisationWorkInProgress1 = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress1.setSource(Source.IMPORT);
        organisationWorkInProgress1.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress1.setPrivacyConsent(true);
        organisationWorkInProgress1 = organisationWorkInProgressRepository.save(organisationWorkInProgress1);
        Long id = organisationWorkInProgress1.getId();


        OrganisationWorkInProgress organisationWorkInProgress2 = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress2.setSource(Source.IMPORT);
        organisationWorkInProgress2.setStatus(OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
        organisationWorkInProgress2.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress2.setPrivacyConsent(true);
        organisationWorkInProgress2 = organisationWorkInProgressRepository.save(organisationWorkInProgress2);

        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getFirstUserWithEmailInGroup(anyString())).thenReturn(Optional.of("u-1"));
        UserRepresentation user = new UserRepresentation();
        user.setFirstName(organisationWorkInProgress1.getContactWorkInProgress().getFirstName());
        user.setLastName(organisationWorkInProgress1.getContactWorkInProgress().getLastName());
        user.setEmail(organisationWorkInProgress1.getContactWorkInProgress().getEmail());
        initKeycloakUser(user);

        OrganisationWorkInProgress finalOrganisationWorkInProgress = organisationWorkInProgress1;
        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(null, null,
                        finalOrganisationWorkInProgress.getId(), PermissionPool.ORGANISATION_PUBLISH);

        // When
        mockMvc.perform(
                        post(BASE_API_URL + "/{0}/releases", organisationWorkInProgress1.getRandomUniqueId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        Optional<OrganisationWorkInProgress> savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id);
        List<Organisation> organisations =
                organisationRepository.findAll();
        Optional<DuplicateList> maybeDuplicateList1 =
                duplicateListRepository.findByOrganisationWorkInProgress(organisationWorkInProgress1);


        assertThat(savedOrganisationWorkInProgress.isPresent()).isTrue();
        assertThat(savedOrganisationWorkInProgress.get().getStatus()).isEqualTo(
                OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION);
        assertThat(maybeDuplicateList1.isPresent()).isTrue();
        assertThat(organisations).hasSize(0);
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Kontakt == Ersteller
     * Erwartung: Endet als Erfolgreich erstellte Organisation ohne Einladung.
     */
    @Test
    @WithMockUser(roles = PermissionPool.GUEST)
    void submitOrganisationWorkInProgressForApproval_ContactInvite1() throws Exception {

        // Given
        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of());
        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.getFirstUserWithEmailInGroup(anyString())).thenReturn(Optional.of("u-1"));

        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        when(keycloakService.findGroupIdFor(any())).thenReturn(Optional.of("KEYCLOAK_ID"));
        UserRepresentation user = new UserRepresentation();
        user.setFirstName(organisationWorkInProgress.getContactWorkInProgress().getFirstName());
        user.setLastName(organisationWorkInProgress.getContactWorkInProgress().getLastName());
        user.setEmail(organisationWorkInProgress.getContactWorkInProgress().getEmail());
        initKeycloakUser(user);

        OrganisationWorkInProgress finalOrganisationWorkInProgress = organisationWorkInProgress;
        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(null, null,
                        finalOrganisationWorkInProgress.getId(), PermissionPool.ORGANISATION_PUBLISH);

        // When
        mockMvc.perform(
                        post(BASE_API_URL + "/{0}/releases", organisationWorkInProgress.getRandomUniqueId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        Optional<OrganisationWorkInProgress> savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id);
        List<Organisation> organisations =
                organisationRepository.findAll();
        assertThat(savedOrganisationWorkInProgress.isPresent()).isFalse();
        assertThat(organisations).hasSize(1);

        List<ContactInvite> contactInvites =
                contactInviteRepository.findAllByOrganisationAndStatus(organisations.get(0), ContactInviteStatus.OPEN);
        assertThat(contactInvites).hasSize(0);
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, nicht von LandingPage.
     * Kontakt != Ersteller
     * Erwartung: Endet als Erfolgreich erstellte Organisation mit Einladung für Kontakt.
     */
    @Test
    @WithMockUser(roles = PermissionPool.GUEST)
    void submitOrganisationWorkInProgressForApproval_ContactInvite2() throws Exception {

        // Given
        GroupRepresentation groupRepresentation = new GroupRepresentation();
        groupRepresentation.setSubGroups(List.of());

        GroupResource group = mock(GroupResource.class);
        when(group.toRepresentation()).thenReturn(groupRepresentation);
        when(group.members()).thenReturn(List.of());
        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getGroup(any(String.class))).thenReturn(group);
        when(keycloakService.getFirstUserWithEmailInGroup(anyString())).thenReturn(Optional.of("u-1"));

        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        when(keycloakService.findGroupIdFor(any())).thenReturn(Optional.of("KEYCLOAK_ID"));
        UserRepresentation user = initKeycloakUser();

        ContactWorkInProgress requestOrgContact = organisationWorkInProgress.getContactWorkInProgress();

        OrganisationWorkInProgress finalOrganisationWorkInProgress = organisationWorkInProgress;
        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(null, null,
                        finalOrganisationWorkInProgress.getId(), PermissionPool.ORGANISATION_PUBLISH);

        // When
        mockMvc.perform(
                        post(BASE_API_URL + "/{0}/releases", organisationWorkInProgress.getRandomUniqueId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        Optional<OrganisationWorkInProgress> savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id);
        List<Organisation> organisations =
                organisationRepository.findAll();
        assertThat(savedOrganisationWorkInProgress.isPresent()).isFalse();
        assertThat(organisations).hasSize(1);

        List<ContactInvite> contactInvites =
                contactInviteRepository.findAllByOrganisationAndStatus(organisations.get(0), ContactInviteStatus.OPEN);
        assertThat(contactInvites).hasSize(1);

        ContactInvite contactInvite = contactInvites.get(0);
        assertThat(contactInvite.getOrganisation()).isNotNull();
        assertThat(contactInvite.getOrganisationWorkInProgress()).isNull();
        assertThat(contactInvite.getOrganisation().getId()).isEqualTo(organisations.get(0).getId());

        Contact resultOrgContact = organisations.get(0).getContact();
        assertThat(user.getFirstName()).isEqualTo(resultOrgContact.getFirstName());
        assertThat(user.getLastName()).isEqualTo(resultOrgContact.getLastName());
        assertThat(user.getEmail()).isEqualTo(resultOrgContact.getEmail());
        assertThat(contactInvite.getContact().getFirstName()).isEqualTo(requestOrgContact.getFirstName());
        assertThat(contactInvite.getContact().getLastName()).isEqualTo(requestOrgContact.getLastName());
        assertThat(contactInvite.getContact().getEmail()).isEqualTo(requestOrgContact.getEmail());
        assertThat(contactInvite.getEmailSent()).isTrue();

        // @ToDo: Template testen wenn fertig
        /**
         * 2 Calls, einmal Kontaktanfrage, einmal Organisation freigegeben
         */
        Mockito.verify(javaMailSenderImpl, times(2)).send(Mockito.<MimeMessage>any());
    }

    /**
     * Organisation zur Bestätigung einreichen. Keine Duplikate, von LandingPage.
     * Kontakt != Ersteller
     * Erwartung: Endet als Organisation (WIP) im Status FREIGABE_KONTAKT_ORGANISATION mit Einladung für Kontakt.
     */
    @Test
    @WithMockUser(roles = PermissionPool.GUEST)
    void submitOrganisationWorkInProgressForApproval_ContactInvite3() throws Exception {

        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setSource(Source.LANDING_PAGE);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_ID");
        organisationWorkInProgress.setPrivacyConsent(true);
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);
        Long id = organisationWorkInProgress.getId();

        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("123");
        when(keycloakService.getFirstUserWithEmailInGroup(anyString())).thenReturn(Optional.of("u-1"));
        UserRepresentation user = initKeycloakUser();

        ContactWorkInProgress requestOrgContact = organisationWorkInProgress.getContactWorkInProgress();

        OrganisationWorkInProgress finalOrganisationWorkInProgress = organisationWorkInProgress;
        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(null, null,
                        finalOrganisationWorkInProgress.getId(), PermissionPool.ORGANISATION_PUBLISH);

        // When
        mockMvc.perform(
                        post(BASE_API_URL + "/{0}/releases", organisationWorkInProgress.getRandomUniqueId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        Optional<OrganisationWorkInProgress> savedOrganisationWorkInProgress =
                organisationWorkInProgressRepository.findById(id);
        List<Organisation> organisations =
                organisationRepository.findAll();
        assertThat(savedOrganisationWorkInProgress.isPresent()).isTrue();
        assertThat(organisations).hasSize(0);

        List<ContactInvite> contactInvites =
                contactInviteRepository.findAllByOrganisationWorkInProgressAndStatus(
                        savedOrganisationWorkInProgress.get(), ContactInviteStatus.OPEN);
        assertThat(contactInvites).hasSize(1);

        ContactInvite contactInvite = contactInvites.get(0);
        assertThat(contactInvite.getOrganisation()).isNull();
        assertThat(contactInvite.getOrganisationWorkInProgress()).isNotNull();
        assertThat(contactInvite.getOrganisationWorkInProgress().getId()).isEqualTo(
                savedOrganisationWorkInProgress.get().getId());

        ContactWorkInProgress resultOrgContact = savedOrganisationWorkInProgress.get().getContactWorkInProgress();
        assertThat(user.getFirstName()).isEqualTo(resultOrgContact.getFirstName());
        assertThat(user.getLastName()).isEqualTo(resultOrgContact.getLastName());
        assertThat(user.getEmail()).isEqualTo(resultOrgContact.getEmail());
        assertThat(contactInvite.getContact().getFirstName()).isEqualTo(requestOrgContact.getFirstName());
        assertThat(contactInvite.getContact().getLastName()).isEqualTo(requestOrgContact.getLastName());
        assertThat(contactInvite.getContact().getEmail()).isEqualTo(requestOrgContact.getEmail());
        assertThat(contactInvite.getEmailSent()).isTrue();

        // @ToDo: Template testen wenn fertig
        Mockito.verify(javaMailSenderImpl, times(1)).send(Mockito.<MimeMessage>any());
    }

    @Test
    @Transactional
    public void deleteOrganisationWorkInProgressForNewOrganisation() throws Exception {
        // Given
        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setKeycloakGroupId("ORG_WIP_KEYCLOAK");
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        ActivityWorkInProgress activityWorkInProgress = MockDataUtils.getActivityWorkInProgress(clock);
        activityWorkInProgress.setOrganisationWorkInProgress(organisationWorkInProgress);
        activityWorkInProgress = activityWorkInProgressRepository.save(activityWorkInProgress);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("12345-6789-123456", null,
                        organisationWorkInProgress.getId(), PermissionPool.ORGANISATION_DELETE);

        // When
        mockMvc.perform(
                        delete(BASE_API_URL + "/{0}", organisationWorkInProgress.getId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        List<OrganisationWorkInProgress> orgsWip = organisationWorkInProgressRepository.findAll();
        List<ActivityWorkInProgress> actsWip = activityWorkInProgressRepository.findAll();

        verify(keycloakService, times(1))
                .deleteOrganisationGroup("ORG_WIP_KEYCLOAK");

        assertThat(orgsWip).hasSize(0);
        assertThat(actsWip).hasSize(0);
    }

    @Test
    @Transactional
    public void deleteOrganisationWorkInProgressForEditedOrganisation() throws Exception {
        // Given
        Organisation organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId("ORG_KEYCLOAK");
        organisation = organisationRepository.save(organisation);

        OrganisationWorkInProgress organisationWorkInProgress = MockDataUtils.getOrganisationWorkInProgress();
        organisationWorkInProgress.setOrganisation(organisation);
        organisationWorkInProgress.setKeycloakGroupId(
                "ORG_WIP_KEYCLOAK"); // Is Null for edits, but set for testing reasons
        organisationWorkInProgress = organisationWorkInProgressRepository.save(organisationWorkInProgress);

        ActivityWorkInProgress activityWorkInProgress = MockDataUtils.getActivityWorkInProgress(clock);
        activityWorkInProgress.setOrganisationWorkInProgress(organisationWorkInProgress);
        activityWorkInProgress = activityWorkInProgressRepository.save(activityWorkInProgress);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken("12345-6789-123456", organisation.getId(),
                        null, PermissionPool.ORGANISATION_DELETE);

        // When
        mockMvc.perform(
                        delete(BASE_API_URL + "/{0}", organisationWorkInProgress.getId())
                                .with(token)
                                .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        List<Organisation> orgs = organisationRepository.findAll();
        List<OrganisationWorkInProgress> orgsWip = organisationWorkInProgressRepository.findAll();
        List<ActivityWorkInProgress> actsWip = activityWorkInProgressRepository.findAll();

        verify(keycloakService, times(0))
                .deleteOrganisationGroup("ORG_KEYCLOAK");
        verify(keycloakService, times(0))
                .deleteOrganisationGroup("ORG_WIP_KEYCLOAK");

        assertThat(orgs).hasSize(1);
        assertThat(orgsWip).hasSize(0);
        assertThat(actsWip).hasSize(0);
    }

    private UserRepresentation initKeycloakUser() {
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setFirstName("Max");
        userRepresentation.setLastName("Muster");
        userRepresentation.setEmail("Max.Muster@Exxeta.test.com");
        return initKeycloakUser(userRepresentation);
    }

    private UserRepresentation initKeycloakUser(UserRepresentation userRepresentation) {
        UserResource userResource = mock(UserResource.class);
        when(userResource.toRepresentation()).thenReturn(userRepresentation);
        when(keycloakService.getUserResource(any())).thenReturn(userResource);
        return userRepresentation;
    }

    @TestConfiguration
    public static class TestConf {
        @Bean
        Clock clock() {
            return Clock.fixed(Instant.parse("2022-08-01T16:22:27.605Z"), ZoneId.of("Europe/Berlin"));
        }
    }
}
