package com.exxeta.wpgwn.wpgwnapp.excel_import.dto;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportType;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class ImportProcessDto {

    private final Long id;

    private final ImportType importType;

    private final ImportSource importSource;

    private final String importFileName;

    private final List<String> importWarnings = new ArrayList<>();

    private final List<String> importExceptions = new ArrayList<>();

}
