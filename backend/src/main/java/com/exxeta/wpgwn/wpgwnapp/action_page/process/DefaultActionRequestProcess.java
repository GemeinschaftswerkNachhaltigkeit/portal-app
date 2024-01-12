package com.exxeta.wpgwn.wpgwnapp.action_page.process;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.DefaultFormDto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class DefaultActionRequestProcess implements ActionPageRequestProcess {

    private final ObjectMapper objectMapper;

    @Override
    public void validate(ActionFromRequestDto actionFromRequestDto) {

    }

    private DefaultFormDto getActionPageForm(ActionFromRequestDto actionFromRequestDto) {

        try {
            DefaultFormDto dto = objectMapper
                    .readValue(actionFromRequestDto.getPayload(), DefaultFormDto.class);
            return dto;
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }


}
