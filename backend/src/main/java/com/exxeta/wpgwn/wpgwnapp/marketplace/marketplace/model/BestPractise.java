package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

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
