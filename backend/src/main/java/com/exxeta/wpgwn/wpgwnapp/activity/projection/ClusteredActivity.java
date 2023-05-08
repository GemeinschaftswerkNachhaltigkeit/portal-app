package com.exxeta.wpgwn.wpgwnapp.activity.projection;


import org.springframework.beans.factory.annotation.Value;

public interface ClusteredActivity {

    @Value("#{target.number_points}")
    Long getNumberPoints();

    @Value("#{target.first_activity_id}")
    Long getFirstActivityId();

    /**
     * Die Position auf der Karte.
     */
    String getCoordinate();

    @Value("#{target.first_activity_name}")
    String getFirstActivityName();

}
