package com.exxeta.wpgwn.wpgwnapp.files;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private final FileProperties fileProperties;

    public String saveFile(@NonNull MultipartFile file) throws IOException {
        final Path path = Path.of(fileProperties.getBaseDirectory());
        final Path directory = Files.createDirectories(path);

        final String ext = FilenameUtils.getExtension(file.getOriginalFilename());
        final UUID uuid = UUID.randomUUID();
        final String filename = uuid + "." + ext;
        final Path destination = Path.of(directory.toString(), filename);

        log.error("path: " + path);
        log.error("filename: " + filename);

        Files.copy(file.getInputStream(), destination);
        log.error("saved file with name [{}], filename [{}]", file.getOriginalFilename(), filename);
        return filename;
    }

    public void deleteIfChanged(boolean hasChanged, String logoPath) {
        if (hasChanged) {
            try {
                deleteFileIfPresent(logoPath);
            } catch (IOException e) {
                log.warn("Unexpected error deleting no longer needed logo [{}]", logoPath);
            }
        }
    }

    public boolean deleteFileIfPresent(@Nullable String filename) throws IOException {
        if (StringUtils.hasText(filename)) {
            final Path filePath = Path.of(fileProperties.getBaseDirectory(),
                    filename);
            log.debug("delete file with id [{}]", filename);
            return Files.deleteIfExists(filePath);
        }

        return false;
    }

    public Resource loadFile(@NonNull String filename) {
        final Path filePath = Path.of(fileProperties.getBaseDirectory(),
                filename);
        log.trace("load file with id [{}]", filename);
        return new FileSystemResource(filePath);
    }
}
