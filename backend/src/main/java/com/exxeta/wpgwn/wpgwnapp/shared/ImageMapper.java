package com.exxeta.wpgwn.wpgwnapp.shared;

import java.util.Objects;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import com.exxeta.wpgwn.wpgwnapp.files.DefaultImageService;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.BestPractiseWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.OfferWorkInProgress;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public abstract class ImageMapper {

    @SuppressWarnings("VisibilityModifier")
    @Autowired
    DefaultImageService defaultImageService;

    @Named("mapImageOrActivityDefault")
    public String mapActivityImage(String image) {
        if (Objects.isNull(image)) {
            return defaultImageService.getActivityDefaultImage();
        } else {
            return image;
        }
    }

    @Named("mapImageOrOrganisationDefault")
    public String mapOrganisationImage(String image) {
        if (Objects.isNull(image)) {
            return defaultImageService.getOrganisationDefaultImage();
        } else {
            return image;
        }
    }

    @Named("mapImageOrBestPractiseDefault")
    public String mapImageOrBestPractiseDefault(BestPractiseWorkInProgress workInProgress) {
        if (Objects.isNull(workInProgress.getImage())) {
            return defaultImageService.getMarketplaceDefaultImage(workInProgress.getBestPractiseCategory());
        } else {
            return workInProgress.getImage();
        }
    }

    @Named("mapImageOrOfferDefault")
    public String mapImageOrBestPractiseDefault(OfferWorkInProgress workInProgress) {
        if (Objects.isNull(workInProgress.getImage())) {
            return defaultImageService.getMarketplaceDefaultImage(workInProgress.getOfferCategory());
        } else {
            return workInProgress.getImage();
        }
    }

}
