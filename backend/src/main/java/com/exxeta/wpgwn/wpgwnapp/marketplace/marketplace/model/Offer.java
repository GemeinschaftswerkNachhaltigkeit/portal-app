package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;

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
