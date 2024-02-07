package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;

@Entity
@Getter
@Setter
@DiscriminatorValue("BEST_PRACTISE")
public class BestPractiseWorkInProgress extends MarketplaceWorkInProgress {

    @Column(name = "best_practise_category")
    @Enumerated(EnumType.STRING)
    private BestPractiseCategory bestPractiseCategory;

}
