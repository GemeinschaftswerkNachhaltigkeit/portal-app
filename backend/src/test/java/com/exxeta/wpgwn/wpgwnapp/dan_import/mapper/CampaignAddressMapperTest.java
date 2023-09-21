package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import java.util.Map;

import org.junit.jupiter.api.Test;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;
import com.exxeta.wpgwn.wpgwnapp.nominatim.NominatimService;
import com.exxeta.wpgwn.wpgwnapp.nominatim.dto.NominatimDto;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Location;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

public class CampaignAddressMapperTest {

    @Test
    public void testMapperLocation_WhenOnlineCampaign_ReturnsLocation() {
        // Create test data for an online campaign
        Campaign campaign = new Campaign();
        campaign.setVenue(null);
        campaign.setLink("https://example.com");

        // Create a mock NominatimService
        NominatimService nominatimService = mock(NominatimService.class);

        // Create the object under test
        CampaignAddressMapper mapper = new CampaignAddressMapper(nominatimService);

        // Call the method
        Location location = mapper.mapperLocation(campaign);

        // Assert the result
        assertTrue(location.getOnline());
        assertEquals("https://example.com", location.getUrl());
        assertNull(location.getCoordinate());
        assertNull(location.getAddress());

        // Verify that NominatimService methods were not called
        verifyNoInteractions(nominatimService);
    }

    @Test
    public void testMapperLocation_WhenValidVenue_ReturnsLocationWithAddress() {
        // Create test data for a campaign with a valid venue
        Campaign campaign = new Campaign();
        campaign.setVenue("123 Main St, City, Country");
        campaign.setLatitude("42.123456");
        campaign.setLongitude("-78.654321");

        // Create a mock NominatimService
        NominatimService nominatimService = mock(NominatimService.class);
        NominatimDto nominatimDto = new NominatimDto();
        NominatimDto.AddressDto addressDto = new NominatimDto.AddressDto();
        addressDto.setRoad("Main St");
        addressDto.setHouseNumber("123");
        addressDto.setPostCode("12345");
        addressDto.setCountry("Country");
        addressDto.setState("State");
        addressDto.setCity("City");
        nominatimDto.setAddress(addressDto);
        when(nominatimService.searchAddress("123 Main St, City, Country")).thenReturn(nominatimDto);

        // Create the object under test
        CampaignAddressMapper mapper = new CampaignAddressMapper(nominatimService);

        // Call the method
        Location location = mapper.mapperLocation(campaign);

        // Assert the result
        assertFalse(location.getOnline());
        assertNull(location.getUrl());
        assertNotNull(location.getCoordinate());
        assertNotNull(location.getAddress());
        assertEquals("Main St", location.getAddress().getStreet());
        assertEquals("123", location.getAddress().getStreetNo());
        assertEquals("12345", location.getAddress().getZipCode());
        assertEquals("Country", location.getAddress().getCountry());
        assertEquals("State", location.getAddress().getState());
        assertEquals("City", location.getAddress().getCity());

        // Verify that NominatimService methods were called
        verify(nominatimService, times(1)).searchAddress("123 Main St, City, Country");
    }

    @Test
    public void testMapperLocation_WhenInvalidVenue_ThrowsException() {
        // Create test data for a campaign with an invalid venue
        Campaign campaign = new Campaign();
        campaign.setVenue("Invalid Venue");

        // Create a mock NominatimService
        NominatimService nominatimService = mock(NominatimService.class);
        when(nominatimService.searchAddress("Invalid Venue")).thenReturn(null);

        // Create the object under test
        CampaignAddressMapper mapper = new CampaignAddressMapper(nominatimService);

        // Assert that the exception is thrown
        DanXmlImportCancelledException exception = assertThrows(DanXmlImportCancelledException.class,
                () -> mapper.mapperLocation(campaign));

        // Assert the error message
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("campaign.address"));
        assertEquals("Invalid Venue is invalid", errorMessages.get("campaign.address"));

        // Verify that NominatimService methods were called
        verify(nominatimService, times(2)).searchAddress("Invalid Venue");
    }
}

