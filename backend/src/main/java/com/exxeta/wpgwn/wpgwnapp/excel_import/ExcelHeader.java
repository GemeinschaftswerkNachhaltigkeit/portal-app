package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.springframework.util.StringUtils;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.IWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ImpactArea;
import com.exxeta.wpgwn.wpgwnapp.shared.model.ThematicFocus;

/**
 * Definiert die Enums für den Kopf der Excel Tabelle für Firmenkunden Objekte.
 *
 * @author schlegti
 * @author buchholj
 */
public interface ExcelHeader {

    static ExcelHeader byColumnIndex(int columnIndex) {
        Optional<ExcelOrganisationHeader> orgHeader = ExcelOrganisationHeader.byColumnIndex(columnIndex);
        if (orgHeader.isPresent()) {
            return orgHeader.get();
        } else {
            return ExcelActivityHeader.byColumnIndex(columnIndex)
                    .orElseThrow(
                            () -> new IllegalArgumentException("No valid ExcelHeader for colIndex: " + columnIndex));
        }
    }

    static <T extends IWorkInProgress> ExcelHeader byColumnIndexAndObjectType(int columnIndex, T object) {
        if (object instanceof OrganisationWorkInProgress) {
            return ExcelOrganisationHeader.byColumnIndex(columnIndex).orElse(null);
        } else if (object instanceof ActivityWorkInProgress) {
            return ExcelActivityHeader.byColumnIndex(columnIndex).orElse(null);
        }
        throw new IllegalArgumentException("No valid ExcelHeaders for object: " + object.getClass());
    }

    static Set<ThematicFocus> getThematicFocusSetFromValue(String stringCellValue) {
        return Arrays.stream(stringCellValue.split(","))
                .map(val -> val.replaceAll("[^\\x00-\\x7F]", ""))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .map(Integer::valueOf)
                .map(ThematicFocus::getById)
                .collect(Collectors.toSet());
    }

    static ImpactArea getImpactArea(String stringCellValue) {
        String value = stringCellValue.trim().toUpperCase();
        try {
            return ImpactArea.valueOf(value);
        } catch (IllegalArgumentException iae) {
            switch (value) {
                case "LOKAL": return ImpactArea.LOCAL;
                case "KONTINENT":
                case "EUROPAWEIT": return ImpactArea.CONTINENT;
                case "LANDESWEIT": return ImpactArea.STATE;
                case "BUNDESWEIT": return ImpactArea.COUNTRY;
                case "WELT":
                case "WELTWEIT":
                case "GLOBAL": return ImpactArea.WORLD;
                default: throw iae;
            }
        }
    }

    static String getCleanedString(Cell cell) {
        return cell.getStringCellValue().replaceAll("\\u00A0", "").trim();
    }

    /**
     * Validiert, dass die übergebene {@link Cell} genau den Wert des Headers erhält.
     *
     * @param cell   Zelle, die überprüft werden soll.
     * @param rowNum
     * @throws IllegalArgumentException falls die Zelle nicht den korrekten Inhalt hat.
     */
    void validateCellEqualsHeader(Cell cell, int rowNum);

    <T extends IWorkInProgress> void setValueOfWorkInProgressObject(T workInProgressObject, Cell cell);

    static boolean isValidUrl(String value) {
        if (value == null || value.isEmpty()) {
            return true;
        }

        try {
            new java.net.URL(value);
            return true;
        } catch (MalformedURLException e) {
            return false;
        }
    }
}
