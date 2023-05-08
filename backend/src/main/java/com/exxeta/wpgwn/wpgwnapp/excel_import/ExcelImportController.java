package com.exxeta.wpgwn.wpgwnapp.excel_import;

import javax.annotation.security.RolesAllowed;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportType;
import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportResultDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

@RestController
@RequestMapping("/api/v1/import")
@RequiredArgsConstructor
@Slf4j
public class ExcelImportController {
    private final ImportProcessMapper importProcessMapper;
    private final ExcelImportService excelImportService;
    private final ImportProcessRepository importProcessRepository;

    /**
     * Importiert {@link OrganisationWorkInProgress} und {@link ActivityWorkInProgress} Objekte aus einem Excel-File
     */
    @Transactional
    @RolesAllowed(PermissionPool.RNE_ADMIN)
    @PostMapping("excel")
    public ImportResultDto importOrganisations(
            @RequestParam("file") MultipartFile file,
            @RequestParam("importSource") ImportSource importSource
    ) {
        final ImportResultDto result = new ImportResultDto();
        final ImportProcess importProcess = new ImportProcess();
        importProcess.setImportType(ImportType.EXCEL);
        importProcess.setImportSource(importSource);
        importProcess.setImportFileName(file.getOriginalFilename());

        try {
            List<OrganisationWorkInProgress> importedOrganisations =
                    excelImportService.importOrganisationAndActivityWorkInProgressFromExcelFile(file, importProcess);
            List<ActivityWorkInProgress> importedActivities = importedOrganisations.stream()
                    .map(OrganisationWorkInProgress::getActivitiesWorkInProgress)
                    .filter(set -> !set.isEmpty())
                    .flatMap(Set::stream)
                    .collect(Collectors.toUnmodifiableList());

            importedOrganisations.forEach(org -> org.setImportProcess(importProcess));
            importedActivities.forEach(act -> act.setImportProcess(importProcess));

            excelImportService.saveOrganisationsWipAndActivityWipToRepositories(
                    importedOrganisations, importedActivities);

            result.setImportedOrganisations(importedOrganisations.size());
            result.setImportedActivities(importedActivities.size());
        } catch (Exception e) {
            log.error("Error while importing data from excel [{}]", file.getOriginalFilename(), e);
            importProcess.getImportExceptions().add(e.getMessage());
        }

        final ImportProcess savedImportProcess = importProcessRepository.save(importProcess);
        result.setImportProcess(importProcessMapper.importProcessToDto(savedImportProcess));

        return result;
    }

}
