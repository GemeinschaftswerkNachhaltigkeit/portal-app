package com.exxeta.wpgwn.wpgwnapp.api.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

@Data
public class ApiOfferResponseDto extends ApiMarketplaceResponseDto {

    private final OfferCategory offerCategory;

}
