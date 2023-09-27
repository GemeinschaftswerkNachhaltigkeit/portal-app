package com.exxeta.wpgwn.wpgwnapp.files;

import java.io.IOException;
import java.net.URI;
import java.util.Random;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.BestPractiseCategory;
import com.exxeta.wpgwn.wpgwnapp.marketplace.shared.OfferCategory;

/**
 * Service, der Default Bilder für Organisationen und Aktivitäten bereitstellt.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DefaultImageService {
    public static final String CLASSPATH_IMAGES = "classpath:images";
    public static final String CLASSPATH_IMAGES_ORGANISATION = CLASSPATH_IMAGES + "/organisations/*";
    public static final String CLASSPATH_IMAGES_ACTIVITY = CLASSPATH_IMAGES + "/activities/*";
    public static final String CLASSPATH_IMAGES_MARKETPLACE = CLASSPATH_IMAGES + "/marketplace/{category}/*";

    private final ResourceLoader resourceLoader;
    private final Random random;


    public String getOrganisationDefaultImage() {
        return getDefaultImage(CLASSPATH_IMAGES_ORGANISATION);
    }

    public String getActivityDefaultImage() {
        return getDefaultImage(CLASSPATH_IMAGES_ACTIVITY);
    }

    public String getMarketplaceDefaultImage(@NonNull OfferCategory offerCategory) {
        String classpath = new UriTemplate(CLASSPATH_IMAGES_MARKETPLACE)
                .expand(offerCategory.toString().toLowerCase())
                .toString();
        return getDefaultImage(classpath);
    }

    public String getMarketplaceDefaultImage(@NonNull BestPractiseCategory bestPractiseCategory) {
        String classpath = new UriTemplate(CLASSPATH_IMAGES_MARKETPLACE)
                .expand(bestPractiseCategory.toString().toLowerCase())
                .toString();
        return getDefaultImage(classpath);
    }

    private String getDefaultImage(String locationPattern) {
        final Resource[] resources;
        try {
            ClassLoader cl = this.getClass().getClassLoader();
            ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
            resources = resolver.getResources(locationPattern);
            for (Resource resource : resources) {
                log.debug("Location Pattern: " + resource.toString());
            }
        } catch (IOException e) {
            log.error("Unexpected error listing resources in location [{}]", locationPattern, e);
            return null;
        }

        if (resources.length == 0) {
            return null;
        }

        final int rndIdx = random.nextInt(resources.length);
        URI uri;
        try {
            uri = resources[rndIdx].getURI();
            log.info("resources[rndIdx].getURI(): " + uri);
        } catch (IOException e) {
            log.error("Unexpected error converting path to uri [{}]", resources[rndIdx], e);
            return null;
        }

        final String searchPattern = locationPattern.substring(CLASSPATH_IMAGES.length(), locationPattern.length() - 1);
        final int idx = uri.toString().lastIndexOf(searchPattern);
        return uri.toString().substring(idx + 1);
    }

    public Resource loadDefaultImage(String filename) {
        return resourceLoader.getResource(CLASSPATH_IMAGES + filename);
    }

}
