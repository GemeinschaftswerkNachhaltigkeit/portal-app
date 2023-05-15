package com.exxeta.wpgwn.wpgwnapp.files;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
            for (Resource resource: resources) {
                log.error("Location Pattern: " + resource.toString());
            }
        } catch (IOException e) {
            log.error("Unexpected error listing resources in location [{}]", locationPattern, e);
            return null;
        }

        if (resources.length == 0) {
            return null;
        }

        final int rndIdx = random.nextInt(resources.length);
        final Path path;
        try {
            path = Paths.get(resources[rndIdx].getURI());
        } catch (IOException e) {
            log.error("Unexpected error converting path to uri [{}]", resources[rndIdx], e);
            return null;
        }

        final String uriPath = path.toUri().toString();
        final String searchPattern = locationPattern.substring(CLASSPATH_IMAGES.length(), locationPattern.length() - 1);
        final int idx = uriPath.lastIndexOf(searchPattern);
        return uriPath.substring(idx + 1);
    }

    public Resource loadDefaultImage(String filename) {
        return resourceLoader.getResource(CLASSPATH_IMAGES + filename);
    }

}
