package com.exxeta.wpgwn.wpgwnapp.map_search;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.transaction.annotation.Transactional;

import com.exxeta.wpgwn.wpgwnapp.map_search.model.MapSearchResult;

public interface MapSearchResultRepository extends JpaRepository<MapSearchResult, String>,
        QuerydslPredicateExecutor<MapSearchResult> {

    @Transactional
    @Modifying
    @Query(value = "refresh materialized view v_search_result", nativeQuery = true)
    void refreshView();

}
