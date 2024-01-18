package com.exxeta.wpgwn.wpgwnapp.dan_import.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(name = "import_dan_xml_process",
        indexes = {
                @Index(name = "import_id_idx", columnList = "import_Id")
        })
@Getter
@Setter
@ToString(callSuper = true)
public class ImportDanXmlProcess extends AuditableEntityBase {

    @Column(name = "import_filename", nullable = false)
    private String importFilename;

    @Column(name = "import_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ImportStatus importStatus;

    @Column(name = "import_id", nullable = false)
    private String importId;

    @Column(name = "report", columnDefinition = "text")
    private String report;

}
