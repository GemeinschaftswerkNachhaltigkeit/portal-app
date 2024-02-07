package com.exxeta.wpgwn.wpgwnapp.action_page.controller;


import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageService;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.processor.ActionPageRequestProcessor;

@RestController
@RequestMapping("/api/public/v1/action-page")
@RequiredArgsConstructor
public class ActionPageController {

    private final ActionPageService actionPageService;

    @PostMapping("/form")
    public void createActionPage(
            @Valid @RequestBody ActionFromRequestDto requestDto) {

        ActionPageRequestProcessor actionPageRequestProcessor
                = actionPageService.getActionPageRequestProcessor(requestDto);

        actionPageRequestProcessor.validate(requestDto);

        if (!actionPageRequestProcessor.isExist(requestDto)) {

            actionPageRequestProcessor.create(requestDto);

            actionPageRequestProcessor.postConstruct(requestDto);
        }
    }

}
