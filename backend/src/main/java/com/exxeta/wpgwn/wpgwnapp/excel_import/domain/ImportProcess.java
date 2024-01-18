package com.exxeta.wpgwn.wpgwnapp.excel_import.domain;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(name = "import_process")
@Getter
@Setter
public class ImportProcess extends AuditableEntityBase {

    @Column(name = "import_type")
    @Enumerated(EnumType.STRING)
    private ImportType importType;

    @Column(name = "import_source")
    @Enumerated(EnumType.STRING)
    private ImportSource importSource;

    @Column(name = "import_file_name")
    private String importFileName;

    @Column(name = "import_warnings")
    @ElementCollection
    private List<String> importWarnings = new ArrayList<>();

    @Column(name = "import_exceptions")
    @ElementCollection
    private List<String> importExceptions = new ArrayList<>();

}
