package com.exxeta.wpgwn.wpgwnapp.action_page.service.processor;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.DefaultFormDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPage;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageRepository;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.Validator;

import java.util.Optional;

import static org.springframework.util.StringUtils.hasText;

@RequiredArgsConstructor
public abstract class AbstractDefaultActionRequestProcessor implements ActionPageRequestProcessor {

    @Getter
    private final ActionPageRepository actionPageRepository;

    private final ObjectMapper objectMapper;
    @Getter
    private final Validator validator;

    private final ApplicationEventPublisher eventPublisher;

    @Override
    public void validate(ActionFromRequestDto actionFromRequestDto) {
        DefaultFormDto dto = getActionPageForm(actionFromRequestDto);
        BindingResult errors = initBindingResult(actionFromRequestDto);

        getValidator().validate(dto, errors);
        validateStationAttribute(dto, errors);

        if (errors.hasErrors()) {
            throw new ValidationException(errors);
        }
    }

    public boolean isExist(ActionFromRequestDto actionFromRequestDto) {
        return actionPageRepository.existsByUniqueHash(actionFromRequestDto.getUniqueHash());
    }

    public void create(ActionFromRequestDto actionFromRequestDto) {
        ActionPage actionPage = mapToActionPage(actionFromRequestDto);
        actionPage.setPostConstructJob(getFormKey().getPostConstructJob());
        actionPageRepository.save(actionPage);
    }

    public void postConstruct(ActionFromRequestDto actionFromRequestDto) {
        eventPublisher.publishEvent(actionFromRequestDto);
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

    private void validateStationAttribute(DefaultFormDto dto, BindingResult errors) {
        boolean isStationAttributeInvalid = Optional.ofNullable(dto.getAttributes())
                .map(attrs -> attrs.size() != 1
                        || !attrs.containsKey("station")
                        || !hasText(attrs.get("station").getKey()))
                .orElse(true);

        if (isStationAttributeInvalid) {
            errors.addError(new FieldError("form", "station", "invalid.station"));
        }
    }

    private ActionPage mapToActionPage(ActionFromRequestDto actionFromRequestDto) {
        ActionPage actionPage = new ActionPage();
        actionPage.setUniqueHash(actionFromRequestDto.getUniqueHash());
        actionPage.setPayload(actionFromRequestDto.getPayload());
        actionPage.setFormKey(actionFromRequestDto.getFormKey());
        return actionPage;
    }


}
