package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class CampaignSdgMapperTest {

    @Test
    public void testMapperSustainableDevelopmentGoals_WhenValidCategories_ReturnsSdgSet() {
        // Create test data for a campaign with valid categories
        Campaign campaign = new Campaign();
        campaign.setCategory("Keine Armut; Kein Hunger; Gesundheit und Wohlergehen");

        // Create the object under test
        CampaignSdgMapper mapper = new CampaignSdgMapper();

        // Call the method
        Set<Long> sdgSet = mapper.mapperSustainableDevelopmentGoals(campaign);

        // Assert the result
        Set<Long> expectedSdgSet = new LinkedHashSet<>(Arrays.asList(1L, 2L, 3L));
        assertEquals(expectedSdgSet, sdgSet);
    }

    @Test
    public void testMapperSustainableDevelopmentGoals_WhenInvalidCategories_ThrowsException() {
        // Create test data for a campaign with invalid categories
        Campaign campaign = new Campaign();
        campaign.setCategory("Invalid Category");

        // Create the object under test
        CampaignSdgMapper mapper = new CampaignSdgMapper();

        // Assert that the exception is thrown
        DanXmlImportCancelledException exception = assertThrows(DanXmlImportCancelledException.class,
                () -> mapper.mapperSustainableDevelopmentGoals(campaign));

        // Assert the error message
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("sdg"));
        assertEquals("validation.sdg.required", errorMessages.get("sdg"));
    }
}
