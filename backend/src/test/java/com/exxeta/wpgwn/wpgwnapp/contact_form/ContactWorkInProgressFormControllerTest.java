package com.exxeta.wpgwn.wpgwnapp.contact_form;

import javax.mail.Message;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.StreamUtils;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.util.MailVerifyUtil;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(TestSecurityConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class ContactWorkInProgressFormControllerTest {

    private static final String BASE_API_URL = "/api/public/v1/contact-form";
    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private EmailProperties emailProperties;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ResourceLoader resourceLoader;

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
    void sendContactForm() throws Exception {
        // Given
        final String contactFormJson = StreamUtils.copyToString(
                resourceLoader.getResource("classpath:dtos/contact_form/contact.json").getInputStream(),
                StandardCharsets.UTF_8);

        // When
        mockMvc.perform(post(BASE_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactFormJson))

                // Then
                .andExpect(status().isOk());

        // And
        final MimeMessage receivedMessage = greenMail.getReceivedMessages()[0];
        List<String> allRecipients = List.of("test-empfang@exxeta.com", "ingo.initiative@exxeta.com");
        String expectedTestSubject = "[TECH] Eine neue Anfrage ist auf der Landingpage eingegangen";
        MailVerifyUtil.verifyRecipients(receivedMessage, allRecipients, Message.RecipientType.TO);
        MailVerifyUtil.verifySubject(receivedMessage, emailProperties.getPrefixForSubject() + expectedTestSubject);
    }
}
