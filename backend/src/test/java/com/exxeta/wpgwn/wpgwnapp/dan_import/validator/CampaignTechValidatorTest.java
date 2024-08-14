package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportCancelledException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import static com.exxeta.wpgwn.wpgwnapp.util.MockDataUtils.getWpgwnProperties;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CampaignTechValidatorTest {

    @Test
    public void testValidate_WhenRequiredFieldsMissing_ThrowsException() {
        // Create test data with missing required fields
        Campaign campaign = new Campaign();
        campaign.setId(null);
        campaign.setCategory(null);
        campaign.setName("");
        campaign.setDetailText("Campaign detail text");
        campaign.setOrganizer("Campaign organizer");
        campaign.setOrganizerEmail("organizer@example.com");
        campaign.setDateStart(Instant.now());
        campaign.setDateEnd(null);

        // Create the object under test
        CampaignTechValidator validator = new CampaignTechValidator(getWpgwnProperties(true));

        // Assert that the exception is thrown
        DanXmlImportCancelledException exception = assertThrows(DanXmlImportCancelledException.class,
                () -> validator.validate(campaign));

        // Assert the error messages
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("id"));
        assertTrue(errorMessages.containsKey("category"));
        assertTrue(errorMessages.containsKey("name"));
        assertFalse(errorMessages.containsKey("detailtext")); // Not a required field
        assertFalse(errorMessages.containsKey("organizer")); // Not a required field
        assertFalse(errorMessages.containsKey("organizer_email")); // Not a required field
        assertFalse(errorMessages.containsKey("date_start")); // Not a required field
        assertTrue(errorMessages.containsKey("date_end"));
        assertEquals("validation.id.required", errorMessages.get("id"));
        assertEquals("validation.category.required", errorMessages.get("category"));
        assertEquals("validation.name.required", errorMessages.get("name"));
        assertEquals("validation.date_end.required", errorMessages.get("date_end"));
    }

    @Test
    public void testValidate_WhenDatesInvalid_ThrowsException() {
        // Create test data with invalid dates
        Campaign campaign = new Campaign();
        campaign.setId("campaignId");
        campaign.setCategory("category");
        campaign.setName("Campaign Name");
        campaign.setDetailText("Campaign detail text");
        campaign.setOrganizer("Campaign organizer");
        campaign.setOrganizerEmail("organizer@example.com");
        campaign.setDateStart(Instant.now());
        campaign.setDateEnd(Instant.now().minus(1, ChronoUnit.DAYS)); // End date before start date

        // Create the object under test
        CampaignTechValidator validator = new CampaignTechValidator(getWpgwnProperties(true));

        // Assert that the exception is thrown
        DanXmlImportCancelledException exception = assertThrows(DanXmlImportCancelledException.class,
                () -> validator.validate(campaign));

        // Assert the error message for the date_end field
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("date_end"));
        assertEquals("validation.date_end.must.after.date_start", errorMessages.get("date_end"));
    }

    @Test
    public void testValidate_WhenNoErrors_NoExceptionThrown() {
        // Create test data with all required fields present and valid dates
        Campaign campaign = new Campaign();
        campaign.setId("campaignId");
        campaign.setCategory("category");
        campaign.setName("Campaign Name");
        campaign.setDetailText("Campaign detail text");
        campaign.setOrganizer("Campaign organizer");
        campaign.setOrganizerEmail("organizer@example.com");
        campaign.setDateStart(Instant.now());
        campaign.setDateEnd(Instant.now().plus(1, ChronoUnit.DAYS));

        // Create the object under test
        CampaignTechValidator validator = new CampaignTechValidator(getWpgwnProperties(true));

        // Call the method and assert no exception is thrown
        assertDoesNotThrow(() -> validator.validate(campaign));

        campaign.setCategory(null);
        // Create the object under test
        CampaignTechValidator validatorWithSdgNotRequired = new CampaignTechValidator(getWpgwnProperties(false));

        // Call the method and assert no exception is thrown
        assertDoesNotThrow(() -> validatorWithSdgNotRequired.validate(campaign));
    }
}

