package com.exxeta.wpgwn.wpgwnapp.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil.ContentType;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil.MailVerifyAttachment;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil.MailVerifyInByteArrayFileAttachment;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

@Import(TestSecurityConfiguration.class)
@SpringBootTest
class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private EmailProperties emailProperties;

    private GreenMail greenMail;

    @BeforeEach
    void setUp() {
        greenMail = new GreenMail(new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), "smtp"));
        greenMail.start();
    }

    @AfterEach
    void tearDown() {
        greenMail.stop();
    }

    @Test
    void sendMail() throws MessagingException, IOException {
        // Given
        String fromAddress = "from-test@exxeta.com";
        List<String> toAddresses = List.of("test-to@exxeta.com");
        List<String> ccAddresses = List.of("test-cc@exxeta.com");
        List<String> bccAddresses = List.of("test-bcc1@exxeta.com", "test-bcc2@exxeta.com");

        String testSubject = "EMail Test Subject";
        Email testEmail = Email.builder()
                .from(fromAddress)
                .tos(toAddresses)
                .ccs(ccAddresses)
                .bccs(bccAddresses)
                .htmlText(true)
                .subject(testSubject)
                .content("<h1>Das ist ein Test!</h1>")
                .build();

        // When
        emailService.sendMail(testEmail);

        List<String> allRecipients = new ArrayList<>();
        allRecipients.addAll(toAddresses);
        allRecipients.addAll(ccAddresses);

        // Then
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];
        MailVerifyUtil.verifySimpleMail(receivedMessage, new MailVerifyUtil.MailVerifyProperties(
                "classpath:testsamples/email/test-mail.html",
                ContentType.HTML,
                fromAddress,
                allRecipients,
                emailProperties.getPrefixForSubject() + testSubject));
    }

    @Test
    void sendMailWithAttachment() throws MessagingException, IOException, NoSuchAlgorithmException {
        // Given
        String fromAddress = "from-test@exxeta.com";
        List<String> toAddresses = List.of("test-to@exxeta.com");

        String testSubject = "EMail Test Subject";
        byte[] testData = getRandomBytes(50);
        AttachmentData attachment = AttachmentData.builder()
                .filename("test.rnd")
                .payload(testData)
                .build();
        Email testEmail = Email.builder()
                .from(fromAddress)
                .tos(toAddresses)
                .htmlText(true)
                .subject(testSubject)
                .content("<h1>Das ist ein Test!</h1>")
                .attachment(attachment)
                .build();

        // When
        emailService.sendMail(testEmail);

        // Then
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];
        MailVerifyAttachment att1 =
                new MailVerifyInByteArrayFileAttachment(attachment.getPayload(), "application/octet-stream",
                        attachment.getFilename());
        List<MailVerifyAttachment> attachments = List.of(att1);
        MailVerifyUtil.verifyMultipartMail(receivedMessage, new MailVerifyUtil.MailVerifyProperties(
                "classpath:testsamples/email/test-mail.html",
                ContentType.HTML,
                fromAddress,
                toAddresses,
                emailProperties.getPrefixForSubject() + testSubject,
                attachments));
    }

    private byte[] getRandomBytes(int length) throws NoSuchAlgorithmException {
        byte[] randomByteArray = new byte[length];
        SecureRandom.getInstanceStrong().nextBytes(randomByteArray);
        return randomByteArray;
    }
}
