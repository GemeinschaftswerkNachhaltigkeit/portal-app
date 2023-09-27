package com.exxeta.wpgwn.wpgwnapp.building_housing;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.StreamUtils;
import org.thymeleaf.TemplateEngine;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.CmsClientConfiguration;
import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.building_housing.configuration.BuildingAndHousingContactProperties;
import com.exxeta.wpgwn.wpgwnapp.building_housing.controller.BuildingAndHousingContactController;
import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.BuildingAndHousingContactFormDto;
import com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.BuildingAndHousingMapper;
import com.exxeta.wpgwn.wpgwnapp.building_housing.service.BuildingAndHousingContactRepository;
import com.exxeta.wpgwn.wpgwnapp.building_housing.service.BuildingAndHousingContactService;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsClient;
import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.ServerSetup;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@AutoConfigureMockMvc
@RequiredArgsConstructor
@Import({CmsClientConfiguration.class, TestSecurityConfiguration.class})
public class BuildingAndHousingContactControllerTest {

    @Autowired
    ResourceLoader resourceLoader;
    @Autowired
    private BuildingAndHousingMapper mapper;
    @Autowired
    private EmailProperties emailProperties;
    @Autowired
    private WpgwnProperties wpgwnProperties;
    @Autowired
    private BuildingAndHousingContactProperties contactProperties;
    @Autowired
    private EmailService emailService;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private MessageSource emailMessageSource;
    @Autowired
    @Qualifier("cmsClientForTest")
    private CmsClient cmsClient;
    @Autowired
    private MailProperties mailProperties;

    private GreenMail greenMail;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BuildingAndHousingContactRepository buildingAndHousingContactRepository;

    private BuildingAndHousingContactService buildingAndHousingContactService;

    private BuildingAndHousingContactController controller;

    @BeforeEach
    void setUp() {
        greenMail = new GreenMail(new ServerSetup(mailProperties.getPort(), mailProperties.getHost(), "smtp"));
        greenMail.start();
        buildingAndHousingContactService =
                new BuildingAndHousingContactService(mapper, buildingAndHousingContactRepository, emailProperties,
                        wpgwnProperties, contactProperties, emailService, templateEngine, emailMessageSource,
                        cmsClient);
        controller = new BuildingAndHousingContactController(buildingAndHousingContactService);
    }

    @AfterEach
    void tearDown() {
        buildingAndHousingContactRepository.deleteAll();
        greenMail.stop();
    }

    @Test
    void sendBuildingAndHousingContactForm() throws Exception {
        // Given
        final String contactFormJson = StreamUtils.copyToString(
                resourceLoader.getResource("classpath:dtos/building_housing/contact.json").getInputStream(),
                StandardCharsets.UTF_8);

        BuildingAndHousingContactFormDto contactFormDto =
                objectMapper.readValue(contactFormJson, BuildingAndHousingContactFormDto.class);

        controller.createBuildingAndHousingContact(contactFormDto);

        final boolean existsByUniqueHash =
                buildingAndHousingContactRepository.existsByUniqueHash("1682c94544d7a1836a76d6890145a687");

        assertThat(existsByUniqueHash).isTrue();
        assertThat(greenMail.getReceivedMessages()).hasSize(2);
    }
}
