package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.controller;

import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QBestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QMarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.QOffer;
import com.exxeta.wpgwn.wpgwnapp.utils.BindingCustomizerUtils;

public class MarketplaceBindingCustomizer implements QuerydslBinderCustomizer<QMarketplaceItem> {

    private BindingCustomizerUtils utils = new BindingCustomizerUtils();


    @Override
    public void customize(QuerydslBindings bindings, QMarketplaceItem root) {

        bindings.excluding(root.as(QOffer.class).offerCategory);
        bindings.excluding(root.as(QBestPractise.class).bestPractiseCategory);

//        bindings.bind(root.as(QOffer.class).offerCategory)
//                .as("offerCat").first(SimpleExpression::eq);
//        bindings.bind(root.as(QBestPractise.class).bestPractiseCategory)
//                .as("bestPractiseCat").first(SimpleExpression::eq);

                bindings.excluding(root.organisation);
        bindings.excluding(root.organisation.activities);

        bindings.bind(root.thematicFocus).all(utils.multiValueAndOrConditionsForEnum());
    }
}
