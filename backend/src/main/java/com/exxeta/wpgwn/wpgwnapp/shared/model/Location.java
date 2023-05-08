package com.exxeta.wpgwn.wpgwnapp.shared.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.validation.Valid;
import java.util.Objects;

import org.hibernate.validator.constraints.URL;
import org.locationtech.jts.geom.Point;
import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Location {

    @Embedded
    @Valid
    private Address address;

    @Column(name = "location_online")
    private Boolean online;

    /**
     * Nur für Aktivitäten.
     */
    @Column(name = "private_location")
    private Boolean privateLocation;

    @URL
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
