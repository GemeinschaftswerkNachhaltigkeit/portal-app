package com.exxeta.wpgwn.wpgwnapp.action_page.service;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionPageRequest;
import com.exxeta.wpgwn.wpgwnapp.action_page.email.ActionPageEmailGenerator;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPageEmailType;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.processor.ActionPageRequestProcessor;
import com.exxeta.wpgwn.wpgwnapp.utils.ApplicationContextUtils;

@Service
@RequiredArgsConstructor
public class ActionPageService {

    private final ApplicationContextUtils applicationContextUtils;

    @NotNull
    public ActionPageRequestProcessor getActionPageRequestProcessor(@NotNull ActionPageRequest request) {
        return applicationContextUtils.getBean(request.getFormKey().getProcess());
    }

    @NotNull
    public ActionPageEmailGenerator getActionPageEmailGenerator(@NotNull ActionPageEmailType actionPageEmailType) {
        return applicationContextUtils.getBean(actionPageEmailType.getEmailGenerator());
    }
}
