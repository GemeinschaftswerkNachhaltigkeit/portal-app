package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

@Data
public class OfferResponseDto extends MarketplaceResponseDto {

    private final OfferCategory offerCategory;

}
