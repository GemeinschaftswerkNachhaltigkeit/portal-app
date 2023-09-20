package com.exxeta.wpgwn.wpgwnapp.email_opt_out;

import java.time.Clock;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.email_opt_out.model.EmailOptOutEntry;
import com.exxeta.wpgwn.wpgwnapp.security.JwtTokenNames;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;
import com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils;
import com.exxeta.wpgwn.wpgwnapp.util.MockSecurityUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class EmailOptOutTest {

    private static final String BASE_API_URL = "/api/v1/email/opt-out";
    private final String EMAIL_1 = "test.1@exxeta.com";
    private final String EMAIL_2 = "test.2@exxeta.com";
    @Autowired
    private Clock clock;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private EmailOptOutRepository emailOptOutRepository;
    @Autowired
    private EmailOptOutService emailOptOutService;

    @AfterEach
    public void tearDown() {
        emailOptOutRepository.deleteAll();
    }

    @Test
    @Transactional
    public void setExistingToOptOutOptionsByUUID() throws Exception {
        // Setup
        EmailOptOutEntry optOutEntry =
                MockDataUtils.getEmailOptOutEntry(EMAIL_1, clock);
        optOutEntry = emailOptOutRepository.save(optOutEntry);

        // When
        mockMvc.perform(post(BASE_API_URL + "/{uuid}", optOutEntry.getRandomUniqueId())
                        .content(String.format("{\"email\": \"%s\", \"emailOptOutOptions\": [\"%s\"]}",
                                EMAIL_1, EmailOptOutOption.COMPANY_WIP_CONSENT.name()))
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        EmailOptOutEntry optOutEntryResult = emailOptOutRepository.findById(optOutEntry.getId()).orElse(null);

        assertThat(optOutEntryResult).isNotNull();
        assertThat(optOutEntryResult.getEmailOptOutOptions()).containsExactly(EmailOptOutOption.COMPANY_WIP_CONSENT);
        assertThat(emailOptOutService.sendEMail(EMAIL_2, EmailOptOutOption.COMPANY_WIP_CONSENT)).isTrue();
    }

    @Test
    @Transactional
    public void setExistingToNotOptOutableOptionByUUID() throws Exception {
        // Setup
        EmailOptOutEntry optOutEntry =
                MockDataUtils.getEmailOptOutEntry(EMAIL_1, clock);
        optOutEntry = emailOptOutRepository.save(optOutEntry);

        // When
        mockMvc.perform(post(BASE_API_URL + "/{uuid}", optOutEntry.getRandomUniqueId())
                        .content(String.format("{\"email\": \"%s\", \"emailOptOutOptions\": [\"%s\"]}",
                                EMAIL_1, EmailOptOutOption.COMPANY_INVITE.name()))
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        EmailOptOutEntry optOutEntryResult = emailOptOutRepository.findById(optOutEntry.getId()).orElse(null);

        assertThat(optOutEntryResult).isNotNull();
        assertThat(optOutEntryResult.getEmailOptOutOptions()).isEmpty();
        assertThat(emailOptOutService.sendEMail(EMAIL_1, EmailOptOutOption.COMPANY_INVITE)).isTrue();
    }

    @Test
    @Transactional
    public void setExistingToOptOutOptionsByUser() throws Exception {
        // Setup
        EmailOptOutEntry optOutEntry =
                MockDataUtils.getEmailOptOutEntry(EMAIL_1, clock);
        optOutEntry = emailOptOutRepository.save(optOutEntry);

        SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor token =
                MockSecurityUtils.getSecurityToken(EMAIL_1, Map.of(JwtTokenNames.EMAIL, EMAIL_1),
                        PermissionPool.GUEST);

        // When
        mockMvc.perform(post(BASE_API_URL)
                        .with(token)
                        .content(String.format("{\"email\": \"%s\", \"emailOptOutOptions\": [\"%s\"]}",
                                "should be ignored", EmailOptOutOption.COMPANY_WIP_CONSENT.name()))
                        .contentType(MediaType.APPLICATION_JSON))

                // Then
                .andExpect(status().isOk());

        EmailOptOutEntry optOutEntryResult = emailOptOutRepository.findById(optOutEntry.getId()).orElse(null);

        assertThat(optOutEntryResult).isNotNull();
        assertThat(optOutEntryResult.getEmailOptOutOptions()).containsExactly(EmailOptOutOption.COMPANY_WIP_CONSENT);
        assertThat(emailOptOutService.sendEMail(EMAIL_1, EmailOptOutOption.COMPANY_WIP_CONSENT)).isFalse();
    }


}
