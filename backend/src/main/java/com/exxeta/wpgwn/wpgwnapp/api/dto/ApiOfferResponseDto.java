package com.exxeta.wpgwn.wpgwnapp.api.dto;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

import lombok.Data;

@Data
public class ApiOfferResponseDto extends ApiMarketplaceResponseDto {

    private final OfferCategory offerCategory;

}
