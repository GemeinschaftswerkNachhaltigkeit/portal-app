package com.exxeta.wpgwn.wpgwnapp.dan_import.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportDanXmlProcess;

public interface ImportDanXmlProcessRepository extends JpaRepository<ImportDanXmlProcess, Long> {
    List<ImportDanXmlProcess> findAllByOrderByCreatedAtDesc();

    ImportDanXmlProcess findImportDanXmlProcessByImportId(String importId);
}
