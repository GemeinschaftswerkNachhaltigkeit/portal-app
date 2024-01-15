package com.exxeta.wpgwn.wpgwnapp.action_page.service.processor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.validation.Validator;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.FormKey;
import com.exxeta.wpgwn.wpgwnapp.action_page.service.ActionPageRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class BiodiversityRequestProcessor extends AbstractDefaultActionRequestProcessor {


    @Autowired
    public BiodiversityRequestProcessor(ActionPageRepository actionPageRepository,
                                        ObjectMapper objectMapper,
                                        @Qualifier("defaultValidator")
                                        Validator validator, ApplicationEventPublisher eventPublisher) {
        super(actionPageRepository, objectMapper, validator, eventPublisher);
    }

    @Override
    public FormKey getFormKey() {
        return FormKey.BIODIVERSITY;
    }

}
