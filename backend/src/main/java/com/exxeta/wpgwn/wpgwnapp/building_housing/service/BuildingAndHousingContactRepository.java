package com.exxeta.wpgwn.wpgwnapp.building_housing.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.model.BuildingAndHousingContact;

public interface BuildingAndHousingContactRepository extends JpaRepository<BuildingAndHousingContact, Long>,
        QuerydslPredicateExecutor<BuildingAndHousingContact> {

    boolean existsByUniqueHash(String uniqueHash);
}
