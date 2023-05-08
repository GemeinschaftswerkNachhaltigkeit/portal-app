package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;

@Data
public class BestPractiseResponseDto extends MarketplaceResponseDto {

    private BestPractiseCategory bestPractiseCategory;

}
