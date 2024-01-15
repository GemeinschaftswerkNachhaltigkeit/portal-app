package com.exxeta.wpgwn.wpgwnapp.action_page;

import java.nio.charset.StandardCharsets;
import java.util.List;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPage;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.StreamUtils;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.action_page.controller.ActionPageController;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageRepository;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
@Import({TestSecurityConfiguration.class})
public class ActionPageControllerTest {

    @Autowired
    ResourceLoader resourceLoader;

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private ActionPageRepository actionPageRepository;

    @Autowired
    private ActionPageService actionPageService;

    @Autowired
    private ObjectMapper objectMapper;
    private GreenMail greenMail;
    private ActionPageController controller;

    @BeforeEach
    void setUp() {
        greenMail = new GreenMail(new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), "smtp"));

        greenMail.start();

        controller = new ActionPageController(actionPageService);
    }

    @AfterEach
    void tearDown() {
        actionPageRepository.deleteAll();
        greenMail.stop();
    }

    @Test
    void testCreateActionPage() throws Exception {

        // Given
        final String contactFormJson = StreamUtils.copyToString(
                resourceLoader.getResource("classpath:dtos/action_page/form.json").getInputStream(),
                StandardCharsets.UTF_8);

        ActionFromRequestDto formDto =
                objectMapper.readValue(contactFormJson, ActionFromRequestDto.class);

        controller.createActionPage(formDto);

        final boolean existsByUniqueHash =
                actionPageRepository.existsByUniqueHash("c9baea15aee14fba5d7f9a6263dcc920");

        assertThat(existsByUniqueHash).isTrue();
        Thread.sleep(2000);
        assertThat(greenMail.getReceivedMessages()).hasSize(2);
    }
}
