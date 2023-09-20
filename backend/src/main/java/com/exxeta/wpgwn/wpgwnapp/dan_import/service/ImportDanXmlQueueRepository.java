package com.exxeta.wpgwn.wpgwnapp.dan_import.service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlQueue;

public interface ImportDanXmlQueueRepository extends JpaRepository<ImportDanXmlQueue, Long> {

    ImportDanXmlQueue findFirstByDanIdOrderByCreatedAtDesc(String danId);
}
