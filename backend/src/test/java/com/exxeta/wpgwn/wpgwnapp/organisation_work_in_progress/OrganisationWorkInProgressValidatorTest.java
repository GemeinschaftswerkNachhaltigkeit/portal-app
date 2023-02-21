package com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.validation.SmartValidator;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationMapperImpl;
import com.exxeta.wpgwn.wpgwnapp.shared.ContactValidator;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapperImpl;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ContactWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.user.UserValidator;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapperImpl;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Import({TestSecurityConfiguration.class})
class OrganisationWorkInProgressValidatorTest {

    @Autowired
    SmartValidator smartValidator;

    @Autowired
    ImageMapper imageMapper;

    OrganisationWorkInProgressValidator organisationWorkInProgressValidator;

    @BeforeEach
    void setUp() {
        organisationWorkInProgressValidator = new OrganisationWorkInProgressValidator(
                new OrganisationMapperImpl(new DateMapperImpl(), new SharedMapperImpl(), imageMapper),
                new ContactValidator(new SharedMapperImpl()), new UserValidator(), smartValidator);
    }

    @Test
    void validateOrganisationForApproval() {
        OrganisationWorkInProgress organisationWorkInProgress = new OrganisationWorkInProgress();
        organisationWorkInProgress.setStatus(OrganisationStatus.FREIGABE_VERWEIGERT_KONTAKT_INITIATIVE);
        ContactWorkInProgress contact = new ContactWorkInProgress();
        contact.setFirstName("test FN");
        contact.setLastName("test LN");
        contact.setEmail("");
        organisationWorkInProgress.setContactWorkInProgress(contact);
        assertThatThrownBy(
                () -> organisationWorkInProgressValidator.validateOrganisationForApproval(organisationWorkInProgress))
                .isInstanceOf(ValidationException.class);
    }
}
