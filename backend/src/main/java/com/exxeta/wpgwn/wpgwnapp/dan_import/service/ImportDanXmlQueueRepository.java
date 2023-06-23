package com.exxeta.wpgwn.wpgwnapp.dan_import.service;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlQueue;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportDanXmlQueueRepository extends JpaRepository<ImportDanXmlQueue, Long> {

    ImportDanXmlQueue findFirstByDanIdOrderByCreatedAtDesc(String danId);
}
