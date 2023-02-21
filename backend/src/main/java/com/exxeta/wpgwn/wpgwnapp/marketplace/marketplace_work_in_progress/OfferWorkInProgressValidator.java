package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress;

import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.MarketplaceWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;

@Component
public class OfferWorkInProgressValidator {
    public void validateSameOrganisation(MarketplaceWorkInProgress offerWorkInProgress, Organisation organisation) {
        if (!Objects.equals(offerWorkInProgress.getOrganisation().getId(), organisation.getId())) {

            final BindingResult errors = new BeanPropertyBindingResult(offerWorkInProgress, "offerWorkInProgress");
            errors.addError(new ObjectError("Organisation ids", "do not match in offerWorkInProgress ["
                    + offerWorkInProgress.getOrganisation().getId()
                    + "] <> [" + organisation.getId() + "]."));
            throw new ValidationException(errors);
        }
    }
}
