package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import com.exxeta.wpgwn.wpgwnapp.activity.DanRangeService;
import com.exxeta.wpgwn.wpgwnapp.activity.dto.DanSetting;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CampaignExpiredValidatorTest {

    private Clock clock = Clock.fixed(Instant.parse("2023-10-08T00:00:00.000Z"), ZoneId.of("Europe/Berlin"));

    private DanRangeService danRangeService = mock(DanRangeService.class);

    private DanSetting danSetting = new DanSetting(true, true,
            LocalDateTime.of(2023, 6, 10, 0, 0, 0, 0),
            LocalDateTime.of(2023, 10, 10, 0, 0, 0, 0),
            LocalDateTime.of(2023, 6, 10, 0, 0, 0, 0),
            LocalDateTime.of(2023, 10, 10, 0, 0, 0, 0) );

    @Test
    public void testValidate_WhenCampaignStartExpired_ThrowsException() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setDateStart(Instant.parse("2023-06-01T00:00:00Z"));
        campaign.setDateEnd(Instant.parse("2023-06-10T00:00:00Z"));

        when(danRangeService.getDanSetting()).thenReturn(danSetting);
        // Create the object under test
        CampaignExpiredValidator validator = new CampaignExpiredValidator(clock, danRangeService);

        // Assert that the exception is thrown
        DanXmlImportIgnoredException exception = assertThrows(DanXmlImportIgnoredException.class,
                () -> validator.validate(campaign));

        // Assert the error message
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("date_start"));
        assertEquals("validation.campaign.is.expired", errorMessages.get("date_start"));
    }

    @Test
    public void testValidate_WhenCampaignEndExpired_ThrowsException() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setDateStart(Instant.parse("2023-06-01T00:00:00Z"));
        campaign.setDateEnd(Instant.parse("2023-06-10T00:00:00Z"));

        DanSetting danSetting = new DanSetting(true, true, null, null, null, null);

        when(danRangeService.getDanSetting()).thenReturn(danSetting);
        // Create the object under test
        CampaignExpiredValidator validator = new CampaignExpiredValidator(clock, danRangeService);

        // Assert that the exception is thrown
        DanXmlImportIgnoredException exception = assertThrows(DanXmlImportIgnoredException.class,
                () -> validator.validate(campaign));

        // Assert the error message
        Map<String, String> errorMessages = exception.getErrorMessages();
        assertTrue(errorMessages.containsKey("date_end"));
        assertEquals("validation.campaign.is.expired", errorMessages.get("date_end"));
    }

    @Test
    public void testValidate_WhenCampaignNotExpired_NoExceptionThrown() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setDateStart(Instant.parse("2023-06-11T00:00:00Z"));
        campaign.setDateEnd(Instant.parse("2023-06-20T00:00:00Z"));

        // Create the object under test
        when(danRangeService.getDanSetting()).thenReturn(danSetting);
        // Create the object under test
        CampaignExpiredValidator validator = new CampaignExpiredValidator(clock, danRangeService);

        // Call the method and assert no exception is thrown
        assertDoesNotThrow(() -> validator.validate(campaign));
    }
}
