package com.exxeta.wpgwn.wpgwnapp.api.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiBestPractiseResponseDto;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiMarketplaceResponseDto;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiOfferResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        uses = {DateMapper.class, SharedMapper.class, ImageMapper.class})
public abstract class ApiMarketplaceMapper {

    public abstract ApiOfferResponseDto mapOfferToDetailsDto(Offer offer);

    public abstract ApiBestPractiseResponseDto mapBestPractiseToResponseDto(BestPractise bestPractise);

    public ApiMarketplaceResponseDto mapMarketplaceItemToResponseDto(MarketplaceItem marketplaceItem) {
        if (marketplaceItem instanceof BestPractise) {
            return mapBestPractiseToResponseDto((BestPractise) marketplaceItem);
        } else if (marketplaceItem instanceof Offer) {
            return mapOfferToDetailsDto((Offer) marketplaceItem);
        } else {
            throw new IllegalArgumentException("Unable to map marketplace item of type ["
                    + marketplaceItem.getClass().getName() + "]");
        }
    }
}
