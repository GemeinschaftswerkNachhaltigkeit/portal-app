package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import static com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils.getWpgwnProperties;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CampaignSdgMapperTest {

    @Test
    public void testMapperSustainableDevelopmentGoals_WhenValidCategories_ReturnsSdgSet() {
        // Create test data for a campaign with valid categories
        Campaign campaign = new Campaign();
        campaign.setCategory("Keine Armut; Kein Hunger; Gesundheit und Wohlergehen");

        // Create the object under test
        CampaignSdgMapper mapper = new CampaignSdgMapper(getWpgwnProperties(true));

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
        CampaignSdgMapper mapper = new CampaignSdgMapper(getWpgwnProperties(true));

        // Assert that the exception is thrown
        DanXmlImportCancelledException exception = assertThrows(DanXmlImportCancelledException.class,
                () -> mapper.mapperSustainableDevelopmentGoals(campaign));

        // Assert the error message
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("sdg"));
        assertEquals("validation.sdg.required", errorMessages.get("sdg"));
    }

    @Test
    public void testMapperSustainableDevelopmentGoals_WhenInvalidCategories_and_SdgRequiredFalse_ReturnsDefaultSdgs() {
        // Create test data for a campaign with invalid categories
        Campaign campaign = new Campaign();
        campaign.setCategory("Invalid Category");

        // Create the object under test
        CampaignSdgMapper mapper = new CampaignSdgMapper(getWpgwnProperties(false));

        // Call the method
        Set<Long> sdgSet = mapper.mapperSustainableDevelopmentGoals(campaign);

        // Assert the result
        Set<Long> expectedSdgSet = new LinkedHashSet<>(Arrays.asList(13L));
        assertEquals(expectedSdgSet, sdgSet);
    }
}

