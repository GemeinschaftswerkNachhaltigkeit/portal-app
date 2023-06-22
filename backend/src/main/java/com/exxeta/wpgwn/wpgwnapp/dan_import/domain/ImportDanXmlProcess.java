package com.exxeta.wpgwn.wpgwnapp.dan_import.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.Table;

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

    @Column(name = "import_filename")
    private String importFilename;

    @Column(name = "import_status")
    @Enumerated(EnumType.STRING)
    private ImportStatus importStatus;

    @Column(name = "import_id")
    private String importId;

    @Column(name = "report", columnDefinition = "text")
    private String report;

}
