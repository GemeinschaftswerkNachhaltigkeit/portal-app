package com.exxeta.wpgwn.wpgwnapp.organisation;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity.ActivityRepository;
import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.ActivitySubscriptionRepository;
import com.exxeta.wpgwn.wpgwnapp.activity_subscription.model.ActivitySubscription;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInvite;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteRepository;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteStatus;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateListRepository;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.model.DuplicateList;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembership;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipStatus;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.model.OrganisationMembershipUserType;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.OrganisationSubscriptionRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_subscription.model.OrganisationSubscription;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;
import com.exxeta.wpgwn.wpgwnapp.util.MockSecurityUtils;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class OrganisationControllerTest {

    @Autowired
    Clock clock;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;

    @Autowired
    private OrganisationMembershipRepository organisationMembershipRepository;

    @Autowired
    private OrganisationSubscriptionRepository organisationSubscriptionRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivitySubscriptionRepository activitySubscriptionRepository;

    @Autowired
    private ContactInviteRepository contactInviteRepository;

    @Autowired
    private DuplicateListRepository duplicateListRepository;

    @Autowired
    private DuplicateCheckService duplicateCheckService;

    @MockBean
    private KeycloakService keycloakService;

    @MockBean
    private UserValidator userValidator;

    @Autowired
    private WpgwnProperties properties;

    private static final String BASE_API_URL = "/api/v1/organisations";
    private static final String adminMail = "user_admin@exxeta.com";
    private static final String adminId = "KEYCLOAK_ADMIN_ID";
    private static final String changeMail = "user_change@exxeta.com";
    private static final String changeId = "KEYCLOAK_CHANGE_ID";
    private static final String subMail = "user_sub@exxeta.com";
    private static final String subId = "KEYCLOAK_SUB_ID";
    private static final String groupId = "KEYCLOAK_GROUP";
    private static final String groupIdAdmin = "KEYCLOAK_GROUP_ADMIN";

    private Organisation organisation;
    GroupResource group;
    GroupResource groupAdmin;

    @BeforeEach
    void buildUp() {
        organisationRepository.deleteAll();
        organisation = MockDataUtils.getOrganisation();
        organisation.setKeycloakGroupId(groupId);
        organisation = organisationRepository.save(organisation);

        OrganisationWorkInProgress orgWIP = MockDataUtils.getOrganisationWorkInProgress();
        orgWIP.setOrganisation(organisation);
        orgWIP = organisationWorkInProgressRepository.save(orgWIP);

        Activity activity = MockDataUtils.getActivity();
        activity.setOrganisation(organisation);
        activity = activityRepository.save(activity);

        UserRepresentation adminUser = MockDataUtils.getUserRepresentation(adminMail);
        UserRepresentation changeUser = MockDataUtils.getUserRepresentation(changeMail);
        UserRepresentation subUser = MockDataUtils.getUserRepresentation(subMail);

        adminUser.setId(adminId);
        changeUser.setId(changeId);
        subUser.setId(subId);

        UserResource adminResource = mock(UserResource.class);
        UserResource changeResource = mock(UserResource.class);
        UserResource subResource = mock(UserResource.class);

        when(adminResource.toRepresentation()).thenReturn(adminUser);
        when(adminResource.toRepresentation()).thenReturn(changeUser);
        when(adminResource.toRepresentation()).thenReturn(subUser);

        when(keycloakService.getUser(adminMail)).thenReturn(adminUser);
        when(keycloakService.getUser(changeMail)).thenReturn(changeUser);
        when(keycloakService.getUser(subMail)).thenReturn(subUser);

        when(keycloakService.getUserResource(adminId)).thenReturn(adminResource);
        when(keycloakService.getUserResource(changeId)).thenReturn(changeResource);
        when(keycloakService.getUserResource(subId)).thenReturn(subResource);

        group = mock(GroupResource.class);
        when(group.members()).thenReturn(List.of(changeUser));

        groupAdmin = mock(GroupResource.class);
        when(groupAdmin.members()).thenReturn(List.of(adminUser));

        when(keycloakService.getAdminsGroupId(eq(groupId))).thenReturn(groupIdAdmin);
        when(keycloakService.getGroup(eq(groupId))).thenReturn(group);
        when(keycloakService.getGroup(eq(groupIdAdmin))).thenReturn(groupAdmin);

        OrganisationSubscription orgSub = new OrganisationSubscription();
        orgSub.setOrganisation(organisation);
        orgSub.setSubscribedUserId(subId);
        orgSub = organisationSubscriptionRepository.save(orgSub);

        ActivitySubscription actSub = new ActivitySubscription();
        actSub.setActivity(activity);
        actSub.setSubscribedUserId(subId);
        actSub = activitySubscriptionRepository.save(actSub);

        OrganisationMembership orgMembershipAdmin =
                MockDataUtils.organisationMembership(adminMail, organisation, clock);
        orgMembershipAdmin.setStatus(OrganisationMembershipStatus.ACCEPTED);
        orgMembershipAdmin.setUserType(OrganisationMembershipUserType.ADMIN);
        orgMembershipAdmin = organisationMembershipRepository.save(orgMembershipAdmin);

        OrganisationMembership orgMembershipChange =
                MockDataUtils.organisationMembership(changeMail, organisation, clock);
        orgMembershipChange.setStatus(OrganisationMembershipStatus.ACCEPTED);
        orgMembershipChange.setUserType(OrganisationMembershipUserType.MEMBER);
        orgMembershipChange = organisationMembershipRepository.save(orgMembershipChange);

        OrganisationWorkInProgress independentOrgWip = MockDataUtils.getOrganisationWorkInProgress();
        independentOrgWip = organisationWorkInProgressRepository.save(independentOrgWip);
        duplicateCheckService.checkForDuplicate(independentOrgWip);

        ContactInvite contactInvite = new ContactInvite();
        contactInvite.setOrganisation(organisation);
        contactInvite.setCreatedAt(Instant.now(clock));
        contactInvite.setStatus(ContactInviteStatus.OPEN);
        contactInvite.setRandomUniqueId(UUID.randomUUID());
        contactInvite.setRandomIdGenerationTime(Instant.now(clock));

        Contact contact = new Contact();
        contact.setEmail("contactMail@exxeta.com");
        contact.setFirstName("Konrad");
        contact.setLastName("Kontakt");
        contactInvite.setContact(contact);
        contactInvite = contactInviteRepository.save(contactInvite);
    }

    @AfterEach
    void tearDown() {
        duplicateListRepository.deleteAll();
        organisationSubscriptionRepository.deleteAll();
        organisationWorkInProgressRepository.deleteAll();
        activitySubscriptionRepository.deleteAll();
        organisationMembershipRepository.deleteAll();
        activityRepository.deleteAll();
        organisationRepository.deleteAll();
    }

    @Test
    @Transactional
    void deleteOrganisation() throws Exception {
        doCallRealMethod().when(keycloakService).deleteOrganisationGroup(groupId);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor
                token = MockSecurityUtils.getSecurityToken("testuser", organisation.getId(), null,
                PermissionPool.ORGANISATION_DELETE);

        mockMvc.perform(delete(BASE_API_URL + "/" + organisation.getId()).with(token))
                .andExpect(status().isOk());


        List<Organisation> organisations = organisationRepository.findAll();
        List<OrganisationWorkInProgress> orgWips = organisationWorkInProgressRepository.findAll();
        assertThat(organisations).hasSize(0);
        assertThat(orgWips).hasSize(1);

        Optional<DuplicateList> dupList =
                duplicateListRepository.findByOrganisationWorkInProgress(orgWips.get(0));

        assertThat(dupList.isPresent()).isTrue();
        assertThat(dupList.get().getDuplicateListItems()).hasSize(0);

        List<OrganisationSubscription> orgSubs = organisationSubscriptionRepository.findAll();
        List<ActivitySubscription> actSubs = activitySubscriptionRepository.findAll();
        List<OrganisationMembership> orgMembs = organisationMembershipRepository.findAll();
        List<Activity> activities = activityRepository.findAll();

        assertThat(orgSubs).hasSize(0);
        assertThat(actSubs).hasSize(0);
        assertThat(orgMembs).hasSize(0);
        assertThat(activities).hasSize(0);

        verify(keycloakService, times(1)).getGroup(groupId);
        verify(group, times(1)).remove();
    }
}
