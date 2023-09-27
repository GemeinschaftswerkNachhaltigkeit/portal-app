package com.exxeta.wpgwn.wpgwnapp.cms;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.StationCmsDto;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDataDto;

@Profile("!dev")
@FeignClient(name = "cms-client", url = "${ui-config.directus-base-url}")
public interface CmsClient {

    @RequestMapping(method = RequestMethod.GET, value = "${building-housing-contact.station}")
    StationCmsDto getStation();


    @RequestMapping(method = RequestMethod.GET, value = "${wpgwn.feature-setting-url}", produces = "application/json")
    FeatureDataDto getFeatures();
}
