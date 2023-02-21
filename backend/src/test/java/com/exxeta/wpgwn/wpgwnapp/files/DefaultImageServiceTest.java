package com.exxeta.wpgwn.wpgwnapp.files;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

import static org.assertj.core.api.Assertions.assertThat;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
class DefaultImageServiceTest {

    @Autowired
    DefaultImageService service;

    @Test
    void getOrganisationDefaultImage() {
        String defaultImagePath = service.getOrganisationDefaultImage();
        assertThat(defaultImagePath).startsWith("organisations/");
    }

    @Test
    void getActivityDefaultImage() {
        String defaultImagePath = service.getActivityDefaultImage();
        assertThat(defaultImagePath).startsWith("activities/");
    }

    @Test
    void getMarketplaceJobsDefaultImage() {
        String defaultImagePath = service.getMarketplaceDefaultImage(OfferCategory.JOBS);
        assertThat(defaultImagePath).startsWith("marketplace/jobs/");
    }

    @Test
    void getMarketplaceProjectReportDefaultImage() {
        String defaultImagePath = service.getMarketplaceDefaultImage(BestPractiseCategory.PROJECT_REPORT);
        assertThat(defaultImagePath).startsWith("marketplace/project_report/");
    }

}
