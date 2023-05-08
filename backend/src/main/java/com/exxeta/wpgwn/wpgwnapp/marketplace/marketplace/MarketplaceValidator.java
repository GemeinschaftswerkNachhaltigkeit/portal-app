package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace;

import javax.persistence.EntityManager;
import java.util.Objects;

import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.WpgwnProperties;
import com.exxeta.wpgwn.wpgwnapp.exception.ValidationException;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.MarketplaceType;
import com.exxeta.wpgwn.wpgwnapp.organisation.model.Organisation;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ItemStatus;

@Component
public class MarketplaceValidator {

    private final MarketplaceRepository marketplaceRepository;

    private final WpgwnProperties wpgwnProperties;

    private final JpaEntityInformation<MarketplaceItem, ?> offerEntityInformation;

    private final SmartValidator smartValidator;

    public MarketplaceValidator(MarketplaceRepository marketplaceRepository, WpgwnProperties wpgwnProperties,
                                SmartValidator smartValidator,
                                EntityManager entityManager) {
        this.marketplaceRepository = marketplaceRepository;
        this.wpgwnProperties = wpgwnProperties;
        this.offerEntityInformation = new JpaRepositoryFactory(entityManager).getEntityInformation(MarketplaceItem.class);
        this.smartValidator = smartValidator;
    }

    public void validateSameOrganisation(MarketplaceItem marketplaceItem, Organisation organisation) {
        if (!Objects.equals(marketplaceItem.getOrganisation().getId(), organisation.getId())) {

            final BindingResult errors = new BeanPropertyBindingResult(marketplaceItem, "offer");
            errors.addError(new ObjectError("Organisation ids", "do not match in offer ["
                    + marketplaceItem.getOrganisation().getId()
                    + "] <> [" + organisation.getId() + "]."));
            throw new ValidationException(errors);
        }
    }

    /**
     * Validiert, ob die Organisation vollständig ist und zum Clearing übergeben werden kann.
     */
    public void validateMarketplaceItem(MarketplaceItem marketplaceItem) {
        final BindingResult errors =
                new BeanPropertyBindingResult(marketplaceItem, "offer");
        smartValidator.validate(marketplaceItem, errors);
        if (errors.hasErrors()) {
            throw new ValidationException(errors);
        }
    }

    /**
     * Validiert, dass die maximale Anzahl von Angeboten pro Organisation und Typ nicht überschritten wird.
     */
    void validateMaxItemNumber(MarketplaceItem marketplaceItem) {

        final MarketplaceType type = marketplaceItem.getMarketplaceType();
        long numItemsForOrganisation =
                marketplaceRepository.countMarketplaceItemsByOrganisationAndMarketplaceTypeAndStatus(marketplaceItem.getOrganisation(), type, ItemStatus.ACTIVE);
        if (offerEntityInformation.isNew(marketplaceItem)) {
            numItemsForOrganisation++;
        }
        Integer numMaxItemsPerOrganisation = getMaxForType(type);
        if (numItemsForOrganisation > numMaxItemsPerOrganisation) {

            final BindingResult errors = new BeanPropertyBindingResult(marketplaceItem, type.name());
            errors.addError(new ObjectError(type.name(), " exceeds max number of allowed items ["
                    + numMaxItemsPerOrganisation + "] but saving this would lead to ["
                    + numItemsForOrganisation + "]."));
            throw new ValidationException(errors);
        }
    }

    private Integer getMaxForType(@NonNull MarketplaceType type) {
        switch (type) {
            case BEST_PRACTISE:
                return wpgwnProperties.getMarketplace().getMaxBestPractises();
            case OFFER:
                return wpgwnProperties.getMarketplace().getMaxOffers();
            default:
                return Integer.MAX_VALUE;
        }
    }
}
