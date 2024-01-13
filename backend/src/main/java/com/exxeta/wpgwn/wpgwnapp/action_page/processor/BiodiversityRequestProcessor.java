package com.exxeta.wpgwn.wpgwnapp.action_page.processor;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import com.exxeta.wpgwn.wpgwnapp.action_page.dto.form.DefaultFormDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.dto.request.ActionFromRequestDto;
import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageRepository;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.util.StringUtils.hasText;

@Component
public class BiodiversityRequestProcessor extends AbstractActionRequestProcessor {


    @Autowired
    public BiodiversityRequestProcessor(ActionPageRepository actionPageRepository,
                                        ObjectMapper objectMapper,
                                        @Qualifier("defaultValidator")
                                        Validator validator) {
        super(actionPageRepository, objectMapper, validator);
    }

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


    @Override
    public FormKey getFormKey() {
        return FormKey.BIODIVERSITY;
    }

    private void validateStationAttribute(DefaultFormDto dto, BindingResult errors) {
        boolean isStationAttributeInvalid = Optional.ofNullable(dto.getAttributes())
                .map(attrs -> attrs.size() != 1
                        || !attrs.containsKey("station")
                        || !hasText(attrs.get("station").getKey()))
                .orElse(true);

        if (isStationAttributeInvalid) {
            errors.rejectValue("station", "invalid.station");
        }
    }

}
