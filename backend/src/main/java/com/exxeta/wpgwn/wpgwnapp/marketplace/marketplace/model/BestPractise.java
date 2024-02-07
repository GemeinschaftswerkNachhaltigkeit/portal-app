package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;

@Entity
@Getter
@Setter
@DiscriminatorValue("BEST_PRACTISE")
public class BestPractise extends MarketplaceItem {

    @NotNull
    @Column(name = "best_practise_category")
    @Enumerated(EnumType.STRING)
    private BestPractiseCategory bestPractiseCategory;

}
