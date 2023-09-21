package com.exxeta.wpgwn.wpgwnapp.excel_import;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;

public interface ImportProcessRepository extends JpaRepository<ImportProcess, Long> {
}
