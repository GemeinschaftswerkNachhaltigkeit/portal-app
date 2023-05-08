package com.exxeta.wpgwn.wpgwnapp.excel_import;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(
        prefix = "wpgwn.import.excel"
)
public class ExcelImportProperties {
    public static final int DEFAULT_LIMIT_COLUMNS_FOR_IMPORT = 49;

    private Integer limitColumnsForImport = DEFAULT_LIMIT_COLUMNS_FOR_IMPORT;
}
