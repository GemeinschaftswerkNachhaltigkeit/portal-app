package com.exxeta.wpgwn.wpgwnapp.dan_import.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.Table;
import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

@Entity
@Table(
        name = "import_dan_xml_queue",
        indexes = {
                @Index(name = "import_id_queue_idx", columnList = "import_id"),
                @Index(name = "dan_id_queue_idx", columnList = "dan_id"),
        }
)
@Getter
@Setter
@ToString(callSuper = true)
public class ImportDanXmlQueue extends AuditableEntityBase {
    @Column(name = "dan_id")
    private String danId;
    @Column(name = "latitude")
    private String latitude;
    @Column(name = "longitude")
    private String longitude;
    @Column(name = "category")
    private String category;
    @Column(name = "aimed")
    private String aimed;
    @Column(name = "venue")
    private String venue;
    @Column(name = "name")
    private String name;
    @Column(name = "intro_text")
    private String introText;
    @Column(name = "detail_text")
    private String detailText;
    @Column(name = "organizer")
    private String organizer;
    @Column(name = "organizer_email")
    private String organizerEmail;
    @Column(name = "organizer_tel")
    private String organizerTel;
    @Column(name = "organizer_website")
    private String organizerWebsite;
    @Column(name = "image")
    private String image;

    @Column(name = "link")
    private String link;

    @Column(name = "date_start")
    private Instant dateStart;

    @Column(name = "date_end")
    private Instant dateEnd;

    @Column(name = "import_status")
    @Enumerated(EnumType.STRING)
    private ImportStatus importStatus;

    @Column(name = "import_Type")
    @Enumerated(EnumType.STRING)
    private ImportType importType;

    @Column(name = "unique_key")
    private String uniqueKey;

    @Column(name = "activity_id")
    private Long activityId;

    @Column(name = "import_id")
    private String importId;


}
