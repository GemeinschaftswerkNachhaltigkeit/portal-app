package com.exxeta.wpgwn.wpgwnapp.action_page.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.action_page.model.ActionPage;

public interface ActionPageRepository extends JpaRepository<ActionPage, Long>,
        QuerydslPredicateExecutor<ActionPage> {

    boolean existsByUniqueHash(String uniqueHash);
}
