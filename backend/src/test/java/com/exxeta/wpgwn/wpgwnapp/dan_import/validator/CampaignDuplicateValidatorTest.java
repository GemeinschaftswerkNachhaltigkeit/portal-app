package com.exxeta.wpgwn.wpgwnapp.dan_import.validator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlQueue;
import com.exxeta.wpgwn.wpgwnapp.dan_import.exception.DanXmlImportIgnoredException;
import com.exxeta.wpgwn.wpgwnapp.dan_import.service.ImportDanXmlQueueRepository;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaign;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CampaignDuplicateValidatorTest {

    private ImportDanXmlQueueRepository importDanXmlQueueRepository;

    @BeforeEach
    void setUp() {
        importDanXmlQueueRepository = mock(ImportDanXmlQueueRepository.class);
    }

    @Test
    public void testValidate_WhenDuplicateExists_ThrowsException() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setId("danId");
        String uniqueKey = campaign.uniqueKey();

        ImportDanXmlQueue importDanXmlQueue = new ImportDanXmlQueue();
        importDanXmlQueue.setUniqueKey(uniqueKey);

        // Mock the behavior of importDanXmlQueueRepository
        when(importDanXmlQueueRepository.findFirstByDanIdOrderByCreatedAtDesc("danId"))
                .thenReturn(importDanXmlQueue);

        // Create the object under test
        CampaignDuplicateValidator validator = new CampaignDuplicateValidator(importDanXmlQueueRepository);

        // Assert that an exception is thrown
        assertThrows(DanXmlImportIgnoredException.class, () -> validator.validate(campaign));
    }

    @Test
    public void testValidate_WhenNoDuplicate_ReturnsTrue() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setId("danId");

        ImportDanXmlQueue importDanXmlQueue = new ImportDanXmlQueue();
        importDanXmlQueue.setUniqueKey("uniqueKey");

        // Mock the behavior of importDanXmlQueueRepository
        when(importDanXmlQueueRepository.findFirstByDanIdOrderByCreatedAtDesc("danId"))
                .thenReturn(importDanXmlQueue);

        // Create the object under test
        CampaignDuplicateValidator validator = new CampaignDuplicateValidator(importDanXmlQueueRepository);

        // Invoke the method and assert that it returns true
        assertTrue(validator.validate(campaign));
    }

    @Test
    public void testValidate_WhenNoDuplicate_ReturnsFalse() {
        // Create test data
        Campaign campaign = new Campaign();
        campaign.setId("danId");

        // Mock the behavior of importDanXmlQueueRepository
        when(importDanXmlQueueRepository.findFirstByDanIdOrderByCreatedAtDesc("danId"))
                .thenReturn(null);

        // Create the object under test
        CampaignDuplicateValidator validator = new CampaignDuplicateValidator(importDanXmlQueueRepository);

        // Invoke the method and assert that it returns true
        assertFalse(validator.validate(campaign));
    }
}
