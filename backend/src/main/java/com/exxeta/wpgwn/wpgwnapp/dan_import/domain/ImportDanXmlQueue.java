package com.exxeta.wpgwn.wpgwnapp.dan_import.domain;

import com.exxeta.wpgwn.wpgwnapp.shared.model.AuditableEntityBase;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.Instant;

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
    @Column(name = "dan_id", nullable = false)
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
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "intro_text")
    private String introText;
    @Column(name = "detail_text", columnDefinition = "text", nullable = false)
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

    @Column(name = "date_start", nullable = false)
    private Instant dateStart;

    @Column(name = "date_end", nullable = false)
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
