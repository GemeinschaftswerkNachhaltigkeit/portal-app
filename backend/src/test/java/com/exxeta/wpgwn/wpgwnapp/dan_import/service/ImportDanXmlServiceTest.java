package com.exxeta.wpgwn.wpgwnapp.dan_import.service;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlProcess;
import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlProcessDto;
import com.exxeta.wpgwn.wpgwnapp.dan_import.mapper.ImportDanXmlProcessMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class ImportDanXmlServiceTest {

    @Mock
    private ImportDanXmlProcessRepository importDanXmlProcessRepository;
    @Mock
    private ImportDanXmlProcessMapper importDanXmlProcessMapper;

    @InjectMocks
    private ImportDanXmlService importDanXmlService;

    @Test
    public void testFindAllDanImport_ReturnsImportDanXmlProcessDtoList() {
        // Arrange
        ImportDanXmlProcess importDanXmlProcess = new ImportDanXmlProcess();
        List<ImportDanXmlProcess> importDanXmlProcesses = Collections.singletonList(importDanXmlProcess);
        ImportDanXmlProcessDto importDanXmlProcessDto = new ImportDanXmlProcessDto();
        List<ImportDanXmlProcessDto> expectedDtoList = Collections.singletonList(importDanXmlProcessDto);
        Mockito.when(importDanXmlProcessRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(importDanXmlProcesses);
        Mockito.when(importDanXmlProcessMapper.mapperImportDanXmlProcess(importDanXmlProcess))
                .thenReturn(importDanXmlProcessDto);

        // Act
        List<ImportDanXmlProcessDto> result = importDanXmlService.findAllDanImport();

        // Assert
        assertEquals(expectedDtoList, result);
    }

    @Test
    public void testFindByImportId_ExistingImportId_ReturnsImportDanXmlProcessDto() {
        // Arrange
        String importId = "123";
        ImportDanXmlProcess importDanXmlProcess = new ImportDanXmlProcess();
        ImportDanXmlProcessDto importDanXmlProcessDto = new ImportDanXmlProcessDto();
        Mockito.when(importDanXmlProcessRepository.findImportDanXmlProcessByImportId(importId))
                .thenReturn(importDanXmlProcess);
        Mockito.when(importDanXmlProcessMapper.mapperImportDanXmlProcess(importDanXmlProcess))
                .thenReturn(importDanXmlProcessDto);

        // Act
        ImportDanXmlProcessDto result = importDanXmlService.findByImportId(importId);

        // Assert
        assertEquals(importDanXmlProcessDto, result);
    }

    @Test(expected = EntityNotFoundException.class)
    public void testFindByImportId_NonExistingImportId_ThrowsEntityNotFoundException() {
        // Arrange
        String importId = "123";
        Mockito.when(importDanXmlProcessRepository.findImportDanXmlProcessByImportId(importId))
                .thenReturn(null);

        // Act
        importDanXmlService.findByImportId(importId);

        // Assert
        // EntityNotFoundException should be thrown
    }

}

