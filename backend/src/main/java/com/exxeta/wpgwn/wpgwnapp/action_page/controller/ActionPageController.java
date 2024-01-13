package com.exxeta.wpgwn.wpgwnapp.action_page.controller;


import javax.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.processor.ActionPageRequestProcessor;
import com.exxeta.wpgwn.wpgwnapp.utils.ApplicationContextUtils;

@RestController
@RequestMapping("/api/public/v1/action-page")
@RequiredArgsConstructor
public class ActionPageController {


    private final ApplicationContextUtils applicationContextUtils;

    @PostMapping("/form")
    public void createActionPage(
            @Valid @RequestBody ActionFromRequestDto requestDto) {
        processActionPageRequest(requestDto);
    }


    private void processActionPageRequest(ActionFromRequestDto requestDto) {
        ActionPageRequestProcessor actionPageRequestProcessor
                = applicationContextUtils.getBean(requestDto.getFormKey().getProcess());
        actionPageRequestProcessor.validate(requestDto);
        actionPageRequestProcessor.create(requestDto);
    }

}
