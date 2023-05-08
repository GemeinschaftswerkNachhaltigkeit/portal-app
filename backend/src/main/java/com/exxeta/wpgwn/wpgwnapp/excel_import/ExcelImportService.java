package com.exxeta.wpgwn.wpgwnapp.excel_import;


import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.core.io.InputStreamSource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.shared.IWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.OrganisationStatus;
import com.exxeta.wpgwn.wpgwnapp.shared.model.Source;

import com.github.pjfanning.xlsx.StreamingReader;
import com.github.pjfanning.xlsx.exceptions.ReadException;

/**
 * Helferklasse für das Einlesen der Excel-Tabellen.
 *
 * @author schlegti
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelImportService {

    private final OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    private final ActivityWorkInProgressRepository activityWorkInProgressRepository;
    private final ExcelImportProperties excelImportProperties;

    private final OrganisationWorkInProgressImportValidator organisationWorkInProgressImportValidator;

    private final ActivityWorkInProgressImportValidator activityWorkInProgressImportValidator;

    private final Clock clock;

    /**
     * Liest die Afa Objektdaten für Firmenkunden aus der übergebenen Exceltabelle.
     *
     * @param resource Die Excel Datei als {@link Resource}.
     * @return eine Liste mit den gelesenen Afa Objektdaten.
     * @throws ExcelReadException falls die Datei oder ihr Inhalt nicht verarbeitet werden können.
     */
    public List<OrganisationWorkInProgress> importOrganisationAndActivityWorkInProgressFromExcelFile(Resource resource,
                                                                                                     ImportProcess importProcess)
            throws ExcelReadException {
        return importOrganisationAndActivityWorkInProgressFromExcelFile(resource, resource.getFilename(),
                importProcess);
    }

    public List<OrganisationWorkInProgress> importOrganisationAndActivityWorkInProgressFromExcelFile(MultipartFile file,
                                                                                                     ImportProcess importProcess)
            throws ExcelReadException {
        return importOrganisationAndActivityWorkInProgressFromExcelFile(file, file.getName(), importProcess);
    }

    public List<OrganisationWorkInProgress> importOrganisationAndActivityWorkInProgressFromExcelFile(
            InputStreamSource inputStreamSource,
            String fileName,
            ImportProcess importProcess) throws ExcelReadException {
        final List<OrganisationWorkInProgress> result = new ArrayList<>();

        try (Workbook workbook = StreamingReader.builder().open(inputStreamSource.getInputStream())) {
            log.debug("Reading excel workbook [{}]", fileName);
            final Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                final int rowNum = row.getRowNum();

                log.trace("Reading line [{}] of excel workbook", rowNum);

                if (rowNum == 0 || rowNum == 1) {
                    validateHeaders(row, rowNum);
                } else {
                    Optional<OrganisationWorkInProgress> newOrg = createOrganisationWithActivityFromRow(row, result);
                    newOrg.ifPresent(result::add);
                }
            }
        } catch (IOException | ReadException exception) {
            throw new ExcelReadException("Could not open excel file " + fileName, exception);
        } catch (Exception exception) {
            throw new ExcelReadException("Error parsing content of excel file " + fileName, exception);
        }

        return result;
    }

    /**
     * Needs {@link Transactional} to ensure that both lists are only saved if both succeed.
     * {@link Transactional} needs separat BeanContext to work;
     */
    @Transactional
    public void saveOrganisationsWipAndActivityWipToRepositories(
            List<OrganisationWorkInProgress> orgsWip, List<ActivityWorkInProgress> actsWip) {
        organisationWorkInProgressRepository.saveAll(orgsWip);
        activityWorkInProgressRepository.saveAll(actsWip);
    }

    private Optional<OrganisationWorkInProgress> createOrganisationWithActivityFromRow(Row row,
                                                                                       List<OrganisationWorkInProgress> extractedOrganisationWorkInProgress) {
        OrganisationWorkInProgress organisationWorkInProgress = mapToOrganisationWorkInProgress(row);
        organisationWorkInProgress.setSource(Source.IMPORT);
        organisationWorkInProgress.setStatus(OrganisationStatus.PRIVACY_CONSENT_REQUIRED);
        ActivityWorkInProgress activityWorkInProgress = mapToActivityWorkInProgress(row);
        if (activityWorkInProgressImportValidator.isValidActivity(activityWorkInProgress)) {
            activityWorkInProgress.setSource(Source.IMPORT);
            activityWorkInProgress.setOrganisationWorkInProgress(organisationWorkInProgress);
            organisationWorkInProgress.getActivitiesWorkInProgress().add(activityWorkInProgress);
        } else {
            log.debug("Skip importing invalid activity [{}].", activityWorkInProgress);
        }

        if (organisationWorkInProgressImportValidator.isValidOrganisation(organisationWorkInProgress, extractedOrganisationWorkInProgress)) {
            return Optional.of(organisationWorkInProgress);
        } else {
            log.debug("Skip importing invalid organisation [{}].", organisationWorkInProgress);
            return Optional.empty();
        }
    }

    private OrganisationWorkInProgress mapToOrganisationWorkInProgress(Row row) {
        final OrganisationWorkInProgress object = new OrganisationWorkInProgress();
        object.setRandomIdGenerationTime(Instant.now(clock));
        object.setRandomUniqueId(UUID.randomUUID());
        mapToWorkInProgressObject(row, object);
        return object;
    }

    private ActivityWorkInProgress mapToActivityWorkInProgress(Row row) {
        final ActivityWorkInProgress object = new ActivityWorkInProgress();
        object.setRandomIdGenerationTime(Instant.now(clock));
        object.setRandomUniqueId(UUID.randomUUID());
        mapToWorkInProgressObject(row, object);
        return object;
    }

    private <T extends IWorkInProgress> void mapToWorkInProgressObject(Row row, T object) {
        StreamSupport
                .stream(row.spliterator(), false)
                .filter(Objects::nonNull)
                .filter(cell -> cell.getCellType() != CellType.BLANK)
                .forEach(cell -> {
                    final ExcelHeader header = ExcelHeader.byColumnIndexAndObjectType(cell.getColumnIndex(), object);
                    if (Objects.nonNull(header)) {
                        header.setValueOfWorkInProgressObject(object, cell);
                    }
                });
    }

    private void validateHeaders(Row row, int rowNum) {
        StreamSupport
                .stream(row.spliterator(), false)
                .limit(excelImportProperties.getLimitColumnsForImport())
                .forEach(cell -> {
                    final ExcelHeader header = ExcelHeader.byColumnIndex(cell.getColumnIndex());
                    header.validateCellEqualsHeader(cell, rowNum);
                });
    }
}
