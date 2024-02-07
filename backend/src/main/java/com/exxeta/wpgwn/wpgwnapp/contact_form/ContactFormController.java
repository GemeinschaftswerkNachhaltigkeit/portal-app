package com.exxeta.wpgwn.wpgwnapp.contact_form;

import jakarta.validation.Valid;
import java.util.Set;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.email.Email;
import com.exxeta.wpgwn.wpgwnapp.email.EmailProperties;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;

@RestController
@RequestMapping("api/public/v1/contact-form")
@RequiredArgsConstructor
public class ContactFormController {

    private final ContactFormProperties contactFormProperties;

    private final EmailProperties emailProperties;

    private final EmailService emailService;

    private final ContactFormContentGenerator contentGenerator;

    private final ContactFormUserEmailContentGenerator contactFormUserEmailContentGenerator;

    @PostMapping
    public void sendContactForm(@RequestBody @Valid ContactFormDto contactFormDto) {
        final Email email = Email.builder()
                .htmlText(true)
                .from(emailProperties.getDefaultFrom())
                .tos(contactFormProperties.getRecipients().get(contactFormDto.getContactType()))
                .ccs(contactFormProperties.getCcs())
                .bccs(contactFormProperties.getBccs())
                .subject(contentGenerator.getSubject(contactFormDto.getContactType()))
                .content(contentGenerator.generateMailBody(contactFormDto))
                .build();
        emailService.sendMail(email);

        if (StringUtils.hasText(contactFormDto.getEmail())) {
            final Email emailToUser = Email.builder()
                    .htmlText(true)
                    .from(emailProperties.getDefaultFrom())
                    .tos(Set.of(contactFormDto.getEmail()))
                    .subject(contactFormUserEmailContentGenerator.getSubject(contactFormDto.getContactType()))
                    .content(contactFormUserEmailContentGenerator.generateMailBody(contactFormDto))
                    .build();
            emailService.sendMail(emailToUser);
        }
    }

}
