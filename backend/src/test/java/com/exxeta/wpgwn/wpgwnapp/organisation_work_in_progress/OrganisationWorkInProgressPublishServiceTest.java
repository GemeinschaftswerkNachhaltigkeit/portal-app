package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutService;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapper;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapperImpl;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationService;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.organisation_membership.OrganisationMembershipService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.PublishedEmailContentGeneratorWithOptOutCheck;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapperImpl;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapperImpl;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
class OrganisationWorkInProgressPublishServiceTest {

    final String toAddress = "test@exxeta.com";
    final String contactAddress = "contactAddress@exxeta.com";
    @MockBean
    OrganisationService organisationService;
    @MockBean
    OrganisationMembershipService organisationMembershipService;
    OrganisationWorkInProgressPublishService service;
    @MockBean
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    @MockBean
    private ActivityWorkInProgressService activityWorkInProgressService;
    @MockBean
    private KeycloakService keycloakService;
    @MockBean
    private DuplicateCheckService duplicateCheckService;
    @MockBean
    private ContactInviteService contactInviteService;
    @MockBean
    private EmailService emailService;
    @MockBean
    private EmailOptOutService emailOptOutService;
    @MockBean
    private ApplicationEventPublisher applicationEventPublisher;
    @MockBean
    private FileStorageService fileStorageService;
    @Autowired
    private ImageMapper imageMapper;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private MailToLinkGenerator mailToLinkGenerator;
    @Autowired
    private MessageSource messageSource;
    private EmailProperties emailProps;
    private GreenMail greenMail;
    private OrganisationMapper organisationMapper;

    @BeforeEach
    void setUp() {
        WpgwnProperties wpgwnProps = new WpgwnProperties(0L, null, null, "null", "null",
                "email/organisation-work-in-progress/privacy-consent/organisation-privacy-consent.html","null", "test", "test",
                new WpgwnProperties.ReminderEmail(2,
                        Duration.of(2, ChronoUnit.SECONDS),
                        "* 6 * * * * *",
                        100),
                new WpgwnProperties.CronProperty("* 6 * * * * *"),
                new WpgwnProperties.Duplicate(0.7),
                new WpgwnProperties.ContactInvite(Duration.of(42, ChronoUnit.DAYS)),
                new WpgwnProperties.OrganisationMembership(Duration.of(42, ChronoUnit.DAYS), 12),
                new WpgwnProperties.MarketplaceProperties(10, 10),
                new WpgwnProperties.DanProperties(50)
        );

        MailProperties mailProperties = new MailProperties();
        mailProperties.setHost("localhost");
        mailProperties.setPort(6655);
        mailProperties.setProtocol("smtp");

        emailProps = new EmailProperties();
        emailProps.setDefaultFrom("test-from@exxeta.com");
        emailProps.setPrefixForSubject("Unit Test - ");
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost(mailProperties.getHost());
        javaMailSender.setPort(mailProperties.getPort());
        javaMailSender.setProtocol(mailProperties.getProtocol());
        emailService = new EmailService(javaMailSender, emailOptOutService, emailProps);

        organisationMapper =
                new OrganisationMapperImpl(new DateMapperImpl(), new SharedMapperImpl(), imageMapper);

        when(emailOptOutService.sendEMail(any(), any())).thenReturn(true);

        service = new OrganisationWorkInProgressPublishService(organisationService,
                activityWorkInProgressService,
                organisationWorkInProgressRepository,
                keycloakService,
                duplicateCheckService,
                contactInviteService,
                organisationMembershipService,
                new PublishedEmailContentGeneratorWithOptOutCheck(wpgwnProps, mailToLinkGenerator, templateEngine,
                        messageSource,
                        keycloakService),
                emailService,
                organisationMapper,
                applicationEventPublisher,
                fileStorageService);

        UserRepresentation user = new UserRepresentation();
        user.setEmail(toAddress);
        GroupResource mockGroupResource = Mockito.mock(GroupResource.class);
        when(mockGroupResource.members()).thenReturn(List.of(user));
        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("KEYCLOAK_GROUP_ADMIN");
        when(keycloakService.getGroup(eq("KEYCLOAK_GROUP_ADMIN"))).thenReturn(mockGroupResource);

        greenMail = new GreenMail(
                new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), mailProperties.getProtocol()));
        greenMail.start();
    }

    @AfterEach
    void tearDown() {
        organisationWorkInProgressRepository.deleteAll();
        greenMail.stop();
    }

    @Test
    void sendOrganisationPublishedEmail() throws MessagingException {
        // Given
        final String fromAddress = "test-from@exxeta.com";
        final OrganisationWorkInProgress organisationWorkInProgress = getOrganisationWorkInProgress(contactAddress);
        final Organisation organisation = new Organisation();
        organisationMapper.mapWorkInProgressToOrganisationWithoutActivities(organisationWorkInProgress, organisation);
        organisation.setId(1L);
        organisation.setKeycloakGroupId("KEYCLOAK_GROUP");

        // When
        service.sendOrganisationPublishedEmail(organisation);

        // And
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];

        List<String> allRecipients = List.of(toAddress);
        String expectedSubject = "Herzlich willkommen im Gemeinschaftswerk Nachhaltigkeit!";
        MailVerifyUtil.verifyRecipients(receivedMessage, allRecipients, Message.RecipientType.TO);
        MailVerifyUtil.verifySubject(receivedMessage, emailProps.getPrefixForSubject() + expectedSubject);
    }

    private OrganisationWorkInProgress getOrganisationWorkInProgress(String toAddress) {
        final OrganisationWorkInProgress organisationWorkInProgress = new OrganisationWorkInProgress();
        organisationWorkInProgress.setId(1L);
        organisationWorkInProgress.setName("Name der Organisation");
        organisationWorkInProgress.setDescription("Beschreibung der Organisation");
        LinkedHashSet<Long> sustainableDevelopmentGoals = new LinkedHashSet<>();
        sustainableDevelopmentGoals.add(1L);
        sustainableDevelopmentGoals.add(2L);
        sustainableDevelopmentGoals.add(3L);

        organisationWorkInProgress.setSustainableDevelopmentGoals(sustainableDevelopmentGoals);

        organisationWorkInProgress.setStatus(OrganisationStatus.NEW);
        final ContactWorkInProgress contactWorkInProgress = new ContactWorkInProgress();
        contactWorkInProgress.setEmail(toAddress);
        organisationWorkInProgress.setContactWorkInProgress(contactWorkInProgress);
        return organisationWorkInProgress;
    }

}
