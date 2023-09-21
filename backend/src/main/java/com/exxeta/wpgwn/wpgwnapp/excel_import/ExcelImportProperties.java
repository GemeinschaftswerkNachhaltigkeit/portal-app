package com.exxeta.wpgwn.wpgwnapp.excel_import;


import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(
        prefix = "wpgwn.import.excel"
)
public class ExcelImportProperties {
    public static final int DEFAULT_LIMIT_COLUMNS_FOR_IMPORT = 49;

    private Integer limitColumnsForImport = DEFAULT_LIMIT_COLUMNS_FOR_IMPORT;
}
