package com.exxeta.wpgwn.wpgwnapp.action_page.validation;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonStringValidator implements ConstraintValidator<JsonString, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void initialize(JsonString jsonString) {
    }

    @Override
    public boolean isValid(String jsonString, ConstraintValidatorContext context) {
        try {
            mapper.readTree(jsonString);
            return true;
        } catch (IOException ex) {
        }
        return false;
    }
}
