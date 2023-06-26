package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import java.time.Instant;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CampaignExpiredValidatorTest {

    @Test
    public void testValidate_WhenCampaignExpired_ThrowsException() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setDateStart(Instant.parse("2023-06-01T00:00:00Z"));
        campaign.setDateEnd(Instant.parse("2023-06-10T00:00:00Z"));
        Instant now = Instant.parse("2023-06-15T00:00:00Z");

        // Create the object under test
        CampaignExpiredValidator validator = new CampaignExpiredValidator();

        // Assert that the exception is thrown
        DanXmlImportIgnoredException exception = assertThrows(DanXmlImportIgnoredException.class,
                () -> validator.validate(campaign, now));

        // Assert the error message
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("date_end"));
        assertEquals("validation.campaign.is.expired", errorMessages.get("date_end"));
    }

    @Test
    public void testValidate_WhenCampaignNotExpired_NoExceptionThrown() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setDateStart(Instant.parse("2023-06-01T00:00:00Z"));
        campaign.setDateEnd(Instant.parse("2023-06-20T00:00:00Z"));
        Instant now = Instant.parse("2023-06-15T00:00:00Z");

        // Create the object under test
        CampaignExpiredValidator validator = new CampaignExpiredValidator();

        // Call the method and assert no exception is thrown
        assertDoesNotThrow(() -> validator.validate(campaign, now));
    }
}
