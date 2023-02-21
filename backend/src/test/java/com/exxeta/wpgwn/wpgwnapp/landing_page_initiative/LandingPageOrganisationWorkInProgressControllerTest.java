package com.exxeta.wpgwn.wpgwnapp.landing_page_initiative;

import java.nio.charset.StandardCharsets;

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

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
class LandingPageOrganisationWorkInProgressControllerTest {

    private static final String BASE_API_URL = "/api/public/v1/register-organisation";
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private EmailOptOutRepository emailOptOutRepository;

    @Autowired
    private OrganisationWorkInProgressRepository repository;

    @Autowired
    private MailProperties mailProperties;

    private GreenMail greenMail;

    @BeforeEach
    void setUp() {
        greenMail = new GreenMail(new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), "smtp"));
        greenMail.start();
    }

    @AfterEach
    void tearDown() {
        repository.deleteAll();
        emailOptOutRepository.deleteAll();
        greenMail.stop();
    }


    @Test
    void registerInitiative() throws Exception {
        // Given
        final String newsletterSubscriptionJson = StreamUtils.copyToString(
                resourceLoader.getResource("classpath:dtos/organisations/register.json").getInputStream(),
                StandardCharsets.UTF_8);

        // When
        mockMvc.perform(post(BASE_API_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newsletterSubscriptionJson))

                // Then
                .andExpect(status().isOk())
                .andExpect(content().json(newsletterSubscriptionJson, true));
        assertThat(repository.count()).isEqualTo(1L);
        assertThat(greenMail.getReceivedMessages()).hasSize(3);
    }
}
