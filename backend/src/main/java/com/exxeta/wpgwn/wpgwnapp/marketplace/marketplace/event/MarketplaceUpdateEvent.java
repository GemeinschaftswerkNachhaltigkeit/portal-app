package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.event;

import lombok.Value;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;

@Value
public class MarketplaceUpdateEvent {

    private final MarketplaceItem updatedMarketplaceItem;
}
