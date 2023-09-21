package com.exxeta.wpgwn.wpgwnapp.dan_import.mapper;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlProcess;
import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlResult;
import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlProcessDto;

import com.fasterxml.jackson.databind.ObjectMapper;

import static java.util.Objects.isNull;
import static org.springframework.util.StringUtils.hasText;

@Component
@RequiredArgsConstructor
public class ImportDanXmlProcessMapper {

    private final ObjectMapper objectMapper;

    @SneakyThrows
    public ImportDanXmlProcessDto mapperImportDanXmlProcess(ImportDanXmlProcess importDanXmlProcess) {

        if (isNull(importDanXmlProcess)) {
            return null;
        }
        ImportDanXmlProcessDto importDanXmlProcessDto = new ImportDanXmlProcessDto();
        importDanXmlProcessDto.setImportFilename(importDanXmlProcess.getImportFilename());
        importDanXmlProcessDto.setImportId(importDanXmlProcess.getImportId());
        importDanXmlProcessDto.setImportStatus(importDanXmlProcess.getImportStatus());
        if (hasText(importDanXmlProcess.getReport())) {
            importDanXmlProcessDto.setReport(
                    objectMapper.readValue(importDanXmlProcess.getReport(), ImportDanXmlResult.class));
        }
        return importDanXmlProcessDto;
    }
}
