package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.resource.GroupResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;

import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressService;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteService;
import com.exxeta.wpgwn.wpgwnapp.duplicate_check.DuplicateCheckService;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutService;
import com.exxeta.wpgwn.wpgwnapp.files.FileStorageService;
import com.exxeta.wpgwn.wpgwnapp.keycloak_client.service.KeycloakService;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.FeedbackEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.PrivacyConsentEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.RejectionEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.content_generators.ReminderEmailContentGenerator;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil;
import com.exxeta.wpgwn.wpgwnapp.utils.MailToLinkGenerator;
import com.exxeta.wpgwn.wpgwnapp.utils.ProfileService;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationWorkInProgressServiceTest {

    final String toAddress = "test@exxeta.com";
    final String contactAddress = "contactAddress@exxeta.com";
    @Mock
    OrganisationWorkInProgressRepository repository;
    @Mock
    FeedbackHistoryEntryRepository feedbackHistoryRepository;
    @Mock
    ActivityWorkInProgressService activityWorkInProgressService;
    OrganisationWorkInProgressService service;
    @Mock
    DuplicateCheckService duplicateCheckService;
    @Mock
    KeycloakService keycloakService;
    @Mock
    ContactInviteService contactInviteService;
    @Mock
    OrganisationWorkInProgressPublishService organisationWorkInProgressPublishService;
    GroupResource mockGroupResource;
    @Mock
    private FileStorageService fileStorageService;
    @Mock
    private EmailService emailService;
    @Mock
    private TemplateEngine templateEngine;
    @Mock
    private EmailOptOutService emailOptOutService;
    @Mock
    private ProfileService profileService;
    @Mock
    private MailToLinkGenerator mailToLinkGenerator;
    private EmailProperties emailProps;
    private final Clock clock = Clock.fixed(Instant.parse("2022-08-01T16:22:27.605Z"), ZoneId.of("Europe/Berlin"));
    private GreenMail greenMail;

    @BeforeEach
    void setUp() {
        WpgwnProperties wpgwnProps = new WpgwnProperties(0L, null, null, "null", "null",
                "email/organisation-work-in-progress/privacy-consent/organisation-privacy-consent.html",
                "null", "test",
                "test",
                new WpgwnProperties.ReminderEmail(2,
                        Duration.of(2, ChronoUnit.SECONDS),
                        "* 6 * * * * *",
                        100),
                new WpgwnProperties.CronProperty("* 6 * * * * *"),
                new WpgwnProperties.Duplicate(0.7),
                new WpgwnProperties.ContactInvite(Duration.of(42, ChronoUnit.DAYS)),
                new WpgwnProperties.OrganisationMembership(Duration.of(42, ChronoUnit.DAYS), 12),
                new WpgwnProperties.MarketplaceProperties(10, 10),
                new WpgwnProperties.DanProperties(50, true, Set.of())
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
        MessageSource messageSource = messageSource();
        templateEngine = emailTemplateEngine(messageSource);

        when(emailOptOutService.sendEMail(any(), any())).thenReturn(true);

        service = new OrganisationWorkInProgressService(repository, feedbackHistoryRepository,
                activityWorkInProgressService, fileStorageService,
                emailService, duplicateCheckService, keycloakService, contactInviteService,
                organisationWorkInProgressPublishService,
                new ReminderEmailContentGenerator(wpgwnProps, mailToLinkGenerator, templateEngine, messageSource,
                        keycloakService, emailOptOutService),
                new FeedbackEmailContentGenerator(wpgwnProps, mailToLinkGenerator, templateEngine, messageSource,
                        keycloakService, emailOptOutService),
                new RejectionEmailContentGenerator(wpgwnProps, mailToLinkGenerator, templateEngine, messageSource,
                        keycloakService, emailOptOutService),
                new PrivacyConsentEmailContentGenerator(wpgwnProps, mailToLinkGenerator, templateEngine, messageSource,
                        keycloakService, emailOptOutService),
                profileService,
                clock);

        UserRepresentation user = new UserRepresentation();
        user.setEmail(toAddress);
        mockGroupResource = Mockito.mock(GroupResource.class);
        when(mockGroupResource.members()).thenReturn(List.of(user));
        when(keycloakService.getAdminsGroupId(any(String.class))).thenReturn("KEYCLOAK_GROUP_ADMIN");
        when(keycloakService.getGroup(eq("KEYCLOAK_GROUP_ADMIN"))).thenReturn(mockGroupResource);

        greenMail = new GreenMail(
                new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), mailProperties.getProtocol()));
        greenMail.start();
    }

    @AfterEach
    void tearDown() {
        repository.deleteAll();
        greenMail.stop();
    }

    @Test
    void sendReminderEmail() throws MessagingException, IOException {
        // Given
        Mockito.when(profileService.isProdActive()).thenReturn(true);

        final String fromAddress = "test-from@exxeta.com";
        final OrganisationWorkInProgress organisationWorkInProgress = getOrganisationWorkInProgress(contactAddress);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_GROUP");
        Mockito.when(repository.findById(organisationWorkInProgress.getId()))
                .thenReturn(Optional.of(organisationWorkInProgress));

        when(mockGroupResource.members()).thenReturn(List.of());

        // When
        service.sendReminderEmail(organisationWorkInProgress.getId());

        // And
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];

        List<String> allRecipients = List.of(contactAddress);
        String expectedSubject =
                "Erinnerung: Registrierung im Gemeinschaftswerk Nachhaltigkeit";
        MailVerifyUtil.verifyRecipients(receivedMessage, allRecipients, Message.RecipientType.TO);
        MailVerifyUtil.verifySubject(receivedMessage, emailProps.getPrefixForSubject() + expectedSubject);
    }

    @Test
    void sendFeedbackEmail() throws MessagingException, IOException {
        // Given
        final String fromAddress = "test-from@exxeta.com";
        final OrganisationWorkInProgress organisationWorkInProgress = getOrganisationWorkInProgress(contactAddress);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_GROUP");

        // When
        service.sendFeedbackEmail(organisationWorkInProgress, "Wo sehen Sie Ihre Organisation in 25 Jahren?");

        // And
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];

        List<String> allRecipients = List.of(toAddress);
        String expectedSubject = "Gemeinschaftswerk Nachhaltigkeit: Rückfrage zu deiner Organisation";
        MailVerifyUtil.verifyRecipients(receivedMessage, allRecipients, Message.RecipientType.TO);
        MailVerifyUtil.verifySubject(receivedMessage, emailProps.getPrefixForSubject() + expectedSubject);
    }

    @Test
    void rejectOrganisation() throws MessagingException, IOException {
        // Given
        final String fromAddress = "test-from@exxeta.com";
        final OrganisationWorkInProgress organisationWorkInProgress = getOrganisationWorkInProgress(contactAddress);
        organisationWorkInProgress.setKeycloakGroupId("KEYCLOAK_GROUP");

        // When
        service.rejectOrganisation(organisationWorkInProgress, "Wir testen die Ablehnung der Organisation.");

        // And
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];

        List<String> allRecipients = List.of(toAddress);
        String expectedSubject = "Deine Registrierung für das Gemeinschaftswerk Nachhaltigkeit";
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

    private MessageSource messageSource() {
        final ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("i18n/message");
        messageSource.setDefaultEncoding("UTF-8");

        return messageSource;
    }

    private TemplateEngine emailTemplateEngine(MessageSource messageSource) {
        final SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.addTemplateResolver(htmlTemplateResolver());
        templateEngine.setTemplateEngineMessageSource(messageSource);
        return templateEngine;
    }

    private ITemplateResolver htmlTemplateResolver() {
        final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setPrefix("/templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding("UTF-8");
        templateResolver.setCacheable(false);
        return templateResolver;
    }
}
