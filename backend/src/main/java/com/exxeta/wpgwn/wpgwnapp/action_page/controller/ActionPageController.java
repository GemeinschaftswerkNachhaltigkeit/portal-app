package com.exxeta.wpgwn.wpgwnapp.action_page.controller;


import javax.validation.Valid;

import com.exxeta.wpgwn.wpgwnapp.utils.ApplicationContextUtils;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.ActionFromRequestDto;

@RestController
@RequestMapping("/api/public/v1/action-page")
@RequiredArgsConstructor
public class ActionPageController {


    private ApplicationContextUtils applicationContextUtils;

    @PostMapping
    public void createActionPage(
            @Valid @RequestBody ActionFromRequestDto requestDto) {


    }
    
}
