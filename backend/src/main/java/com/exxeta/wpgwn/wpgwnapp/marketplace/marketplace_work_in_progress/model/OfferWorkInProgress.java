package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

@Entity
@Getter
@Setter
@DiscriminatorValue("OFFER")
public class OfferWorkInProgress extends MarketplaceWorkInProgress {

    @Column(name = "offer_category")
    @Enumerated(EnumType.STRING)
    private OfferCategory offerCategory;

}
