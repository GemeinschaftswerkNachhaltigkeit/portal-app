package com.exxeta.wpgwn.wpgwnapp.shared;

import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.shared.model.Contact;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;


@Service
@RequiredArgsConstructor
@Slf4j
public class ContactValidator {

    private final SharedMapper sharedMapper;

    public BindingResult validate(ContactWorkInProgress contactWorkInProgress) {
        return validate(contactWorkInProgress, "contact", "");
    }

    public BindingResult validate(ContactWorkInProgress contactWorkInProgress, String objectName, String fieldPrefix) {
        return validate(sharedMapper.mapContactWipToContact(contactWorkInProgress), objectName, fieldPrefix);
    }

    public BindingResult validate(ContactWorkInProgress contactWorkInProgress, String objectName, String fieldPrefix,
                                  BindingResult errors) {
        return validate(sharedMapper.mapContactWipToContact(contactWorkInProgress), objectName, fieldPrefix, errors);
    }

    public BindingResult validate(Contact contact) {
        return validate(contact, "contact", "");
    }

    public BindingResult validate(Contact contact, String objectName, String fieldPrefix) {
        BindingResult errors = new BeanPropertyBindingResult(contact, "contact");
        return validate(contact, objectName, fieldPrefix, errors);
    }

    public BindingResult validate(Contact contact, String objectName, String fieldPrefix, BindingResult errors) {
        if (Objects.isNull(contact)) {
            errors.addError(new FieldError(objectName, fieldPrefix + "contact", "Can't be empty!"));
        } else {
            if (!hasFirstName(contact)) {
                errors.addError(new FieldError(objectName, fieldPrefix + "firstName", "Can't be empty!"));
            }
            if (!hasLastName(contact)) {
                errors.addError(new FieldError(objectName, fieldPrefix + "lastName", "Can't be empty!"));
            }
            if (!hasEmail(contact)) {
                errors.addError(new FieldError(objectName, fieldPrefix + "email", "Can't be empty!"));
            }
        }
        return errors;
    }

    private boolean hasFirstName(Contact contact) {
        return StringUtils.hasText(contact.getFirstName());
    }

    private boolean hasLastName(Contact contact) {
        return StringUtils.hasText(contact.getLastName());
    }

    private boolean hasEmail(Contact contact) {
        return StringUtils.hasText(contact.getEmail());
    }
}
