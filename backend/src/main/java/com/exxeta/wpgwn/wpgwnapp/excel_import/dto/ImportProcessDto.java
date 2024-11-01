package com.exxeta.wpgwn.wpgwnapp.excel_import.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportType;


@Data
public class ImportProcessDto {

    private final Long id;

    private final ImportType importType;

    private final ImportSource importSource;

    private final String importFileName;

    private final List<String> importWarnings = new ArrayList<>();

    private final List<String> importExceptions = new ArrayList<>();

}
