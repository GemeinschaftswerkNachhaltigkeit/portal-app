package com.exxeta.wpgwn.wpgwnapp.api.dto;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;

@Data
public class ApiBestPractiseResponseDto extends ApiMarketplaceResponseDto {

    private BestPractiseCategory bestPractiseCategory;

}
