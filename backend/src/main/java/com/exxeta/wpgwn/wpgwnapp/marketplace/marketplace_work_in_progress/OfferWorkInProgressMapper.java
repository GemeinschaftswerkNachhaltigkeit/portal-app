package com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress;

import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.OfferWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.OfferWorkInProgressResponseDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        uses = {DateMapper.class, SharedMapper.class})
public interface OfferWorkInProgressMapper {

    @Mapping(target = "marketplaceItem", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "randomUniqueId", ignore = true)
    @Mapping(target = "randomIdGenerationTime", ignore = true)
    @Mapping(target = "marketplaceType", constant = "OFFER")
    @Mapping(target = "locationWorkInProgress", source = "location")
    @Mapping(target = "contactWorkInProgress", source = "contact")
    @Mapping(target = "organisation", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateOfferWip(OfferWorkInProgressRequestDto offerRequest, @MappingTarget OfferWorkInProgress offer);

    @Mapping(target = "location", source = "locationWorkInProgress")
    @Mapping(target = "contact", source = "contactWorkInProgress")
    OfferWorkInProgressResponseDto mapOfferWorkInProgress(OfferWorkInProgress offer);

}
