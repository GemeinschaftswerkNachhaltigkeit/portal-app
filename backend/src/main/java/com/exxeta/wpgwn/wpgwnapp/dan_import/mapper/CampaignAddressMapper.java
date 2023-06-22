package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;
import com.exxeta.wpgwn.wpgwnapp.nominatim.NominatimService;
import com.exxeta.wpgwn.wpgwnapp.nominatim.dto.NominatimDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Address;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;

import com.google.common.base.Splitter;
import com.google.common.collect.Lists;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.springframework.util.StringUtils.hasText;

@Component
@Slf4j
@RequiredArgsConstructor
public class CampaignAddressMapper {

    private final NominatimService nominatimService;

    public Location mapperLocation(Campaign campaign) {
        Location location = new Location();
        location.setUrl(hasText(campaign.getLink()) ? campaign.getLink() : campaign.getOrganizerWebsite());
        location.setOnline(campaign.online());
        if (location.getOnline()) {
            return location;
        }
        location.setCoordinate(getPointFromStrings(campaign.getLatitude(), campaign.getLongitude()));
        NominatimDto nominatimDto = nominatimService.searchAddress(prepareAndCleaningAddress(campaign.getVenue()));
        if (nonNull(nominatimDto)) {
            if (isNull(location.getCoordinate())) {
                location.setCoordinate(getPoint(nominatimDto.getLatitude(), nominatimDto.getLongitude()));
            }
            location.setAddress(mapperAddress(nominatimDto));
            return location;
        }

        throw new DanXmlImportCancelledException(Map.of("campaign.address", campaign.getVenue() + " is invalid"));
    }

    private String prepareAndCleaningAddress(String venue) {
        venue = venue.trim()
                .replaceAll("\n\r", ",")
                .replaceAll("\n", ",")
                .replaceAll("\r", ",");
        if (!venue.contains(",")) {
            return venue;
        }
        List<String> venueSubStrings = Lists.newLinkedList(Splitter.on(",").omitEmptyStrings()
                .trimResults().split(venue));
        if (venueSubStrings.size() >= 2) {
            Collections.reverse(venueSubStrings);
            return venueSubStrings.get(1) + ", " + venueSubStrings.get(0);
        }
        return venue;
    }


    private Address mapperAddress(NominatimDto nominatimDto) {
        Address address = new Address();
        address.setStreet(nominatimDto.getAddress().getRoad());
        address.setStreetNo(nominatimDto.getAddress().getHouseNumber());
        address.setZipCode(nominatimDto.getAddress().getPostCode());
        address.setCountry(nominatimDto.getAddress().getCountry());
        address.setState(nominatimDto.getAddress().getState());
        address.setCity(nominatimDto.getCity());
        return address;
    }

    private Point getPointFromStrings(String latitude, String longitude) {
        if (hasText(latitude) && hasText(longitude)) {
            try {
                double longitudeDouble = Double.parseDouble(longitude);
                double latitudeDouble = Double.parseDouble(latitude);
                return getPoint(latitudeDouble, longitudeDouble);
            } catch (Exception ex) {
                log.error("getPointFromStrings Error: {}", ex);
                return null;
            }
        }
        return null;
    }

    private Point getPoint(double latitude, double longitude) {
        try {
            GeometryFactory geometryFactory = new GeometryFactory();
            Coordinate coordinate = new Coordinate(latitude, longitude);
            return geometryFactory.createPoint(coordinate);
        } catch (Exception ex) {
            log.error("getPoint Error: {}", ex);
            return null;
        }

    }
}
