package com.exxeta.wpgwn.wpgwnapp.files;

import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.regex.Pattern;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.configuration.properties.ResourceCacheProperties;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final DefaultImageService defaultImageService;

    private final ResourceCacheProperties cacheProperties;

    private final FileStorageService fileStorageService;

    private final Clock clock;

    private final Pattern filenamePattern =
            Pattern.compile("^/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.\\w{1,4}$");


    @GetMapping("{*path}")
    public ResponseEntity<Resource> getDefaultImage(@PathVariable("path") String filepath) {
        if (filenamePattern.matcher(filepath).matches()) {
            final Resource resource = fileStorageService.loadFile(filepath);
            return getResponseEntity(filepath, resource);
        } else {
            final Resource resource = defaultImageService.loadDefaultImage(filepath);
            return getResponseEntity(filepath, resource);
        }
    }

    private ResponseEntity<Resource> getResponseEntity(String filename, Resource resource) {
        if (!resource.exists()) {
            throw new EntityNotFoundException(
                    String.format("Image with name [%s] not found", filename));
        }

        final ResponseEntity.BodyBuilder responseEntity = ResponseEntity.ok()
                .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM));

        final Duration maxAge = cacheProperties.getMaxAge();
        if (cacheProperties.isEnabled() && Objects.nonNull(maxAge)) {
            responseEntity.headers(httpHeaders -> {
                httpHeaders.setCacheControl(CacheControl.maxAge(maxAge));
                httpHeaders.setExpires(Instant.now(clock).plus(maxAge));
                try {
                    httpHeaders.setLastModified(resource.lastModified());
                } catch (IOException e) {
                    log.debug("Unexpected error getting last modified for resource [{}]", resource.getDescription());
                }
            });
        }

        return responseEntity.body(resource);
    }

}
