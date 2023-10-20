package com.exxeta.wpgwn.wpgwnapp.map_search;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapSearchV2Result;

public interface MapSearchV2ResultRepository extends JpaRepository<MapSearchV2Result, String>,
        QuerydslPredicateExecutor<MapSearchV2Result> {

    @Transactional
    @Modifying
    @Query(value = "refresh materialized view v_map_search_v2_result", nativeQuery = true)
    void refreshView();

}
