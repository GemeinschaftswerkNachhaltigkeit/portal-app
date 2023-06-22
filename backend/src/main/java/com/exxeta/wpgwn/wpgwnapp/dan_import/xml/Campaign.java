package com.exxeta.wpgwn.wpgwnapp.dan_import.xml;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.*;

import java.time.Instant;

import static com.exxeta.wpgwn.wpgwnapp.WpgwnAppApplication.DEFAULT_TIME_ZONE;
import static java.util.Objects.nonNull;
import static org.apache.commons.codec.digest.DigestUtils.md5Hex;
import static org.springframework.util.StringUtils.hasText;
import static org.springframework.util.StringUtils.isEmpty;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Campaign {
    @JacksonXmlProperty(localName = "id")
    private String id;
    @JacksonXmlProperty(localName = "latitude")
    private String latitude;
    @JacksonXmlProperty(localName = "longitude")
    private String longitude;
    @JacksonXmlProperty(localName = "category")
    private String category;
    @JacksonXmlProperty(localName = "aimed")
    private String aimed;
    @JacksonXmlProperty(localName = "venue")
    private String venue;
    @JacksonXmlProperty(localName = "name")
    private String name;
    @JacksonXmlProperty(localName = "introtext")
    private String introText;
    @JacksonXmlProperty(localName = "detailtext")
    private String detailText;
    @JacksonXmlProperty(localName = "organizer")
    private String organizer;
    @JacksonXmlProperty(localName = "organizer_email")
    private String organizerEmail;
    @JacksonXmlProperty(localName = "organizer_tel")
    private String organizerTel;
    @JacksonXmlProperty(localName = "organizer_website")
    private String organizerWebsite;
    @JacksonXmlProperty(localName = "images")
    private Images images;
    @JacksonXmlProperty(localName = "link")
    private String link;
    @JacksonXmlProperty(localName = "date_start")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = DEFAULT_TIME_ZONE)
    private Instant dateStart;
    @JacksonXmlProperty(localName = "date_end")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = DEFAULT_TIME_ZONE)
    private Instant dateEnd;

    public boolean online() {
        return !hasText(this.venue);
    }

    public String image() {
        return nonNull(images) && !isEmpty(images.getImage())
                ? images.getImage().get(0) : "";
    }

    public String uniqueKey() {
        String value = "id:" + id
                + "name:" + name
                + "latitude:" + latitude
                + "longitude:" + longitude
                + "category:" + category
                + "venue:" + venue
                + "name:" + name
                + "detailtext:" + detailText
                + "organizer:" + organizer
                + "organizer_email:" + organizerEmail
                + "organizer_website:" + organizerWebsite
                + "images:" + images
                + "link:" + link
                + "date_start:" + dateStart
                + "date_end:" + dateEnd;
        return md5Hex(value).toUpperCase();
    }
}
