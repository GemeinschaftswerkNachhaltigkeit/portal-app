package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace;

import java.time.Clock;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.BestPractiseResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.MarketplaceResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.MarketplaceResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.OfferResponseDetailsDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.dto.OfferResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.BestPractise;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.Offer;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        uses = {DateMapper.class, SharedMapper.class, ImageMapper.class})
public abstract class MarketplaceMapper {

    @SuppressWarnings("VisibilityModifier")
    @Autowired
    Clock clock;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "nameTsVec", ignore = true)
    @Mapping(target = "descriptionTsVec", ignore = true)
    @Mapping(target = "location", source = "locationWorkInProgress")
    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "image", source = "workInProgress", qualifiedByName = "mapImageOrOfferDefault")
    public abstract void updateOfferWithWorkInProgress(OfferWorkInProgress workInProgress, @MappingTarget Offer offer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "nameTsVec", ignore = true)
    @Mapping(target = "descriptionTsVec", ignore = true)
    @Mapping(target = "location", source = "locationWorkInProgress")
    @Mapping(target = "contact", source = "contactWorkInProgress")
    @Mapping(target = "image", source = "workInProgress", qualifiedByName = "mapImageOrBestPractiseDefault")
    public abstract void updateBestPractiseWithWorkInProgress(BestPractiseWorkInProgress workInProgress,
                                                              @MappingTarget BestPractise bestPractise);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "randomUniqueId", expression = "java( java.util.UUID.randomUUID() )")
    @Mapping(target = "randomIdGenerationTime", expression = "java( java.time.Instant.now(clock) )")
    @Mapping(target = "marketplaceItem", source = "offer")
    @Mapping(target = "locationWorkInProgress", source = "location")
    @Mapping(target = "contactWorkInProgress", source = "contact")
    public abstract OfferWorkInProgress mapOfferToWorkInProgress(Offer offer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "randomUniqueId", expression = "java( java.util.UUID.randomUUID() )")
    @Mapping(target = "randomIdGenerationTime", expression = "java( java.time.Instant.now(clock) )")
    @Mapping(target = "marketplaceItem", source = "bestPractise")
    @Mapping(target = "locationWorkInProgress", source = "location")
    @Mapping(target = "contactWorkInProgress", source = "contact")
    public abstract BestPractiseWorkInProgress mapBestPractiseToWorkInProgress(BestPractise bestPractise);

    public abstract OfferResponseDto mapOfferToDetailsDto(Offer offer);

    public abstract BestPractiseResponseDto mapBestPractiseToResponseDto(BestPractise bestPractise);


    public MarketplaceResponseDto mapMarketplaceItemToResponseDto(MarketplaceItem marketplaceItem) {
        if (marketplaceItem instanceof BestPractise) {
            return mapBestPractiseToResponseDto((BestPractise) marketplaceItem);
        } else if (marketplaceItem instanceof Offer) {
            return mapOfferToDetailsDto((Offer) marketplaceItem);
        } else {
            throw new IllegalArgumentException("Unable to map marketplace item of type ["
                    + marketplaceItem.getClass().getName() + "]");
        }
    }

    public abstract OfferResponseDetailsDto mapOfferToResponseDetailsDto(Offer offer);

    public abstract BestPractiseResponseDetailsDto mapBestPractiseToResponseDetailsDto(BestPractise bestPractise);

    public MarketplaceResponseDetailsDto mapMarketplaceItemToDetailsDto(MarketplaceItem marketplaceItem) {
        if (marketplaceItem instanceof BestPractise) {
            return mapBestPractiseToResponseDetailsDto((BestPractise) marketplaceItem);
        } else if (marketplaceItem instanceof Offer) {
            return mapOfferToResponseDetailsDto((Offer) marketplaceItem);
        } else {
            throw new IllegalArgumentException("Unable to map marketplace item of type ["
                    + marketplaceItem.getClass().getName() + "]");
        }
    }
}
