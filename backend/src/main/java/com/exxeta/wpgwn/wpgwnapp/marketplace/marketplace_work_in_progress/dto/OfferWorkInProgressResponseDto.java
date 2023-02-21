package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto;


import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

@Data
public class OfferWorkInProgressResponseDto extends MarketPlaceWorkInProgressResponseDto {

    private final OfferCategory offerCategory;

}
