package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlProcess;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus;
import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlProcessDto;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@RunWith(MockitoJUnitRunner.class)
public class ImportDanXmlProcessMapperTest {

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ImportDanXmlProcessMapper importDanXmlProcessMapper;

    @Test
    public void testMapperImportDanXmlProcess_ValidInput_ReturnsImportDanXmlProcessDto() throws Exception {
        // Arrange
        ImportDanXmlProcess importDanXmlProcess = new ImportDanXmlProcess();
        importDanXmlProcess.setImportFilename("filename");
        importDanXmlProcess.setImportId("123");
        importDanXmlProcess.setImportStatus(ImportStatus.PENDING);
        importDanXmlProcess.setReport(null);
        ImportDanXmlProcessDto expectedDto = new ImportDanXmlProcessDto();
        expectedDto.setImportFilename("filename");
        expectedDto.setImportId("123");
        expectedDto.setImportStatus(ImportStatus.PENDING);
        expectedDto.setReport(null);

        // Act
        ImportDanXmlProcessDto result = importDanXmlProcessMapper.mapperImportDanXmlProcess(importDanXmlProcess);

        // Assert
        assertEquals(expectedDto, result);
    }

    @Test
    public void testMapperImportDanXmlProcess_NullInput_ReturnsNull() throws Exception {
        // Arrange
        ImportDanXmlProcess importDanXmlProcess = null;

        // Act
        ImportDanXmlProcessDto result = importDanXmlProcessMapper.mapperImportDanXmlProcess(importDanXmlProcess);

        // Assert
        assertNull(result);
    }

    @Test
    public void testMapperImportDanXmlProcess_NullReport_ReturnsImportDanXmlProcessDto() throws Exception {
        // Arrange
        ImportDanXmlProcess importDanXmlProcess = new ImportDanXmlProcess();
        importDanXmlProcess.setImportFilename("filename");
        importDanXmlProcess.setImportId("123");
        importDanXmlProcess.setImportStatus(ImportStatus.PENDING);
        importDanXmlProcess.setReport(null);
        ImportDanXmlProcessDto expectedDto = new ImportDanXmlProcessDto();
        expectedDto.setImportFilename("filename");
        expectedDto.setImportId("123");
        expectedDto.setImportStatus(ImportStatus.PENDING);
        expectedDto.setReport(null);

        // Act
        ImportDanXmlProcessDto result = importDanXmlProcessMapper.mapperImportDanXmlProcess(importDanXmlProcess);

        // Assert
        assertEquals(expectedDto, result);
    }

}
