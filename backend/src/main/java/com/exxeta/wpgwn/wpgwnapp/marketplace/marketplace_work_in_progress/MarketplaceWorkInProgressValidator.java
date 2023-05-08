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
public class MarketplaceWorkInProgressValidator {
    public void validateSameOrganisation(MarketplaceWorkInProgress marketplaceWorkInProgress,
                                         Organisation organisation) {
        if (!Objects.equals(marketplaceWorkInProgress.getOrganisation().getId(), organisation.getId())) {

            final BindingResult errors =
                    new BeanPropertyBindingResult(marketplaceWorkInProgress, "marketplaceWorkInProgress");
            errors.addError(new ObjectError("Organisation ids", "do not match in marketplaceWorkInProgress ["
                    + marketplaceWorkInProgress.getOrganisation().getId()
                    + "] <> [" + organisation.getId() + "]."));
            throw new ValidationException(errors);
        }
    }
}
