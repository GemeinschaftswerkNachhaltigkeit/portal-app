package com.exxeta.wpgwn.wpgwnapp.action_page.processor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.DefaultFormDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPage;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageRepository;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

@RequiredArgsConstructor
public abstract class AbstractActionRequestProcessor implements ActionPageRequestProcessor {

    @Getter
    private final ActionPageRepository actionPageRepository;

    private final ObjectMapper objectMapper;
    @Getter
    private final Validator validator;


    public void create(ActionFromRequestDto actionFromRequestDto) {
        if (!isActionRegistered(actionFromRequestDto.getUniqueHash())) {
            ActionPage actionPage = mapToActionPage(actionFromRequestDto);
            actionPage.setStatus(getFormKey().getInitStatus());
            actionPageRepository.save(actionPage);
        }
    }

    protected BindingResult initBindingResult(ActionFromRequestDto actionFromRequestDto) {
        return new BeanPropertyBindingResult(actionFromRequestDto, getFormKey().name());
    }

    public DefaultFormDto getActionPageForm(ActionFromRequestDto actionFromRequestDto) {

        try {
            DefaultFormDto dto = objectMapper
                    .readValue(actionFromRequestDto.getPayload(), DefaultFormDto.class);
            return dto;
        } catch (JsonProcessingException e) {
            final BindingResult errors = initBindingResult(actionFromRequestDto);
            errors.rejectValue("payload", "invalid.payload");
            throw new ValidationException(errors);
        }
    }

    private ActionPage mapToActionPage(ActionFromRequestDto actionFromRequestDto) {
        ActionPage actionPage = new ActionPage();
        actionPage.setUniqueHash(actionFromRequestDto.getUniqueHash());
        actionPage.setPayload(actionFromRequestDto.getPayload());
        actionPage.setFormKey(actionFromRequestDto.getFormKey());
        return actionPage;
    }

    private boolean isActionRegistered(String uniqueHash) {
        return actionPageRepository.existsByUniqueHash(uniqueHash);
    }
}
