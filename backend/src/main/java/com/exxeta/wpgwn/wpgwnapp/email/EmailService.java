package com.exxeta.wpgwn.wpgwnapp.email;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

import com.exxeta.wpgwn.wpgwnapp.action_page.email.ActionPageEmailGenerator;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;

import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.email_opt_out.EmailOptOutService;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    private final EmailOptOutService emailOptOutService;

    private final EmailProperties emailProperties;

    public void sendMail(Email email) {
        try {
            log.debug("Preparing to send email [{}]", email);
            MimeMessage mimeMessage = prepareMail(email);
            javaMailSender.send(mimeMessage);
            log.debug("sendEmail success");
        } catch (MessagingException ex) {
            log.error("Unexpected error sending email.", ex);
        }
    }

    private MimeMessage prepareMail(Email email) throws MessagingException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        boolean hasAttachments = !email.getAttachments().isEmpty();
        MimeMessageHelper mimeMailHelper =
                new MimeMessageHelper(mimeMessage, hasAttachments, StandardCharsets.UTF_8.name());
        mimeMailHelper.setFrom(email.getFrom());
        mimeMailHelper.setSubject(emailProperties.getPrefixForSubject() + email.getSubject());
        mimeMailHelper.setTo(toArray(email.getTos()));
        mimeMailHelper.setCc(toArray(email.getCcs()));
        mimeMailHelper.setBcc(toArray(email.getBccs()));

        if (StringUtils.hasText(email.getReplyTo())) {
            mimeMailHelper.setReplyTo(email.getReplyTo());
        }

        mimeMailHelper.setText(email.getContent(), email.isHtmlText());

        if (hasAttachments) {
            for (AttachmentData attachmentData : email.getAttachments()) {
                mimeMailHelper.addAttachment(attachmentData.getFilename(),
                        new ByteArrayResource(attachmentData.getPayload())
                );
            }
        }
        return mimeMessage;
    }

    private String[] toArray(Set<String> set) {
        if (set != null && !set.isEmpty()) {
            return set.toArray(new String[0]);
        }
        return new String[0];
    }

    public <T> void sendMail(ContentGenerator<T> contentGenerator, T entity) {
        final boolean sendEmail =
                emailOptOutService.sendEMail(contentGenerator.getTo(entity), contentGenerator.getEmailOptOutOption());
        if (sendEmail) {
            final Email email = Email.builder()
                    .htmlText(true)
                    .from(emailProperties.getDefaultFrom())
                    .tos(List.of(contentGenerator.getTo(entity)))
                    .subject(contentGenerator.getSubject())
                    .content(contentGenerator.generateMailBody(entity))
                    .build();

            sendMail(email);
        } else {
            log.warn("E-Mail [{}] for entity [{}] to [{}] disabled due to opt out.",
                    contentGenerator.getEmailOptOutOption(),
                    entity.getClass().getName(),
                    contentGenerator.getTo(entity));
        }
    }

    public <T> void sendActionPageMail(ActionPageEmailGenerator<T> actionPageEmailGenerator,
                                       T entity, ActionPageEmailType emailType,
                                       UserLanguage userLanguage) {
        final Email email = Email.builder()
                .htmlText(true)
                .from(emailProperties.getDefaultFrom())
                .tos(actionPageEmailGenerator.getTo(entity, emailType))
                .subject(actionPageEmailGenerator.getSubject(entity, emailType, userLanguage))
                .content(actionPageEmailGenerator.generateMailBody(entity, emailType, userLanguage))
                .build();

        sendMail(email);
    }
}
