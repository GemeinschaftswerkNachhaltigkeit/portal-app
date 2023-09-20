package com.exxeta.wpgwn.wpgwnapp.files;

import java.io.IOException;
import java.util.UUID;

import org.assertj.core.util.Files;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import static org.assertj.core.api.Assertions.assertThat;

class FileStorageServiceTest {

    private final byte[] payload = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    private FileStorageService fileStorageService;
    private final String testFileName = "test.png";

    @BeforeEach
    void setUp() {

        FileProperties props = new FileProperties(Files.temporaryFolderPath());
        fileStorageService = new FileStorageService(props);
    }

    @Test
    void saveFile() throws IOException {
        final String filename = saveTestData();
        assertThat(filename).isNotNull();
    }

    private String saveTestData() throws IOException {
        final MultipartFile testFile = new MockMultipartFile(testFileName, payload);
        return fileStorageService.saveFile(testFile);
    }

    @Test
    void loadFile() throws IOException {
        final String filename = saveTestData();
        assertThat(filename).isNotNull();
        final Resource resultPayload = fileStorageService.loadFile(filename);

        assertThat(resultPayload.exists()).isEqualTo(true);
        assertThat(StreamUtils.copyToByteArray(resultPayload.getInputStream())).isEqualTo(payload);
    }

    @Test
    void loadNotExistingFile() throws IOException {
        final Resource file = fileStorageService.loadFile(UUID.randomUUID() + ".png");
        assertThat(file.exists()).isEqualTo(false);
    }
}
