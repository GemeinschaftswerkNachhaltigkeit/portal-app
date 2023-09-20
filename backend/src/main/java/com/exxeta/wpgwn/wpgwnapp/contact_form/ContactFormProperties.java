package com.exxeta.wpgwn.wpgwnapp.contact_form;

import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.*;

@ConfigurationProperties("contact-form")
@Getter
@Setter
@Validated
public class ContactFormProperties implements Validator {

    @NotEmpty
    @Valid
    private Map<@NotNull ContactType, @NotEmpty List<@Email String>> recipients = new HashMap<>();

    @NotNull
    @Valid
    private Set<@Email String> ccs = new HashSet<>();

    @NotNull
    @Valid
    private Set<@Email String> bccs = new HashSet<>();

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz == ContactFormProperties.class;
    }

    @Override
    public void validate(Object target, Errors errors) {

        final ContactFormProperties contactFormProperties = (ContactFormProperties) target;

        final Set<ContactType> requiredKeys = Set.of(ContactType.values());
        if (!Objects.equals(contactFormProperties.getRecipients().keySet(), requiredKeys)) {
            errors.rejectValue("recipients",
                    "key are not equal",
                    new Object[] {contactFormProperties.getRecipients().keySet()},
                    "Keys " + requiredKeys + "] must be defined for recipients");
        }
    }
}
