package com.exxeta.wpgwn.wpgwnapp.action_page.service.listener;


import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.ActionPageForm;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.email.ActionPageEmailGenerator;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageService;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.processor.ActionPageRequestProcessor;
import com.exxeta.wpgwn.wpgwnapp.email.EmailService;
import com.exxeta.wpgwn.wpgwnapp.shared.model.UserLanguage;

import static com.exxeta.wpgwn.wpgwnapp.action_page.model.PostConstructJob.EMAIL;

@Component
@RequiredArgsConstructor
public class ActionPageSendEmail {

    private final ActionPageService actionPageService;

    private final EmailService emailService;

    @EventListener
    @Async
    public void handleActionPageSendEmailEvent(ActionFromRequestDto requestDto) {

        // Early return if the post-construct job is not EMAIL
        if (EMAIL != requestDto.getFormKey().getPostConstructJob()) {
            return;
        }

        ActionPageRequestProcessor processor = actionPageService.getActionPageRequestProcessor(requestDto);
        FormKey formKey = requestDto.getFormKey();
        ActionPageForm form = processor.getActionPageForm(requestDto);
        UserLanguage userLanguage = requestDto.getUserLanguage();

        // Send emails for each type defined in the form key
        for (ActionPageEmailType emailType : formKey.getEmailTypes()) {
            ActionPageEmailGenerator emailGenerator = actionPageService.getActionPageEmailGenerator(emailType);
            emailService.sendActionPageMail(emailGenerator, form, emailType, userLanguage);
        }
    }

}
