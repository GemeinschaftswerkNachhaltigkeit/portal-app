package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

@Entity
@Getter
@Setter
@DiscriminatorValue("OFFER")
public class Offer extends MarketplaceItem {

    @NotNull
    @Column(name = "offer_category")
    @Enumerated(EnumType.STRING)
    private OfferCategory offerCategory;

}
