package com.exxeta.wpgwn.wpgwnapp.excel_import;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportProcessRepository extends JpaRepository<ImportProcess, Long> {
}
