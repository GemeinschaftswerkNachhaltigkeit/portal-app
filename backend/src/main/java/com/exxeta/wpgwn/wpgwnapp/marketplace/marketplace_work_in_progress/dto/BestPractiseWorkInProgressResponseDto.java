package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto;


import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;

@Data
public class BestPractiseWorkInProgressResponseDto extends MarketPlaceWorkInProgressResponseDto {

    private BestPractiseCategory bestPractiseCategory;

}
