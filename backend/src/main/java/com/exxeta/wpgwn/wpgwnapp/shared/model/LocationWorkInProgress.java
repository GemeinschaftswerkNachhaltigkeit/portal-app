package com.exxeta.wpgwn.wpgwnapp.shared.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import java.util.Objects;

import org.locationtech.jts.geom.Point;
import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@SuppressWarnings("MagicNumber")
public class LocationWorkInProgress {

    @Embedded
    private Address address;

    /**
     * Nur für Aktivitäten.
     */
    @Column(name = "location_online")
    private Boolean online;


    @Column(name = "location_url")
    private String url;

    /**
     * Die Position auf der Karte.
     */
    @Column(name = "location_coordinate", columnDefinition = "geometry(POINT)")
    private Point coordinate;

    public boolean isEmpty() {
        return (Objects.isNull(address) || address.isEmpty())
                && Objects.isNull(online)
                && !StringUtils.hasText(url)
                && Objects.isNull(coordinate);

    }

}
