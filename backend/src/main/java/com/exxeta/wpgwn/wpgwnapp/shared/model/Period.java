package com.exxeta.wpgwn.wpgwnapp.shared.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Period {

    @Column(name = "period_start")
    private Instant start;

    @Column(name = "period_end")
    private Instant end;

}
