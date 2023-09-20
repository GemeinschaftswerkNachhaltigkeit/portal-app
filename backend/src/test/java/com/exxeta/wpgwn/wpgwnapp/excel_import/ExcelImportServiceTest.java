package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.time.Clock;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.contact_invite.ContactInviteRepository;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportType;
import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportProcessDto;
import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportResultDto;
import com.exxeta.wpgwn.wpgwnapp.organisation.OrganisationRepository;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class ExcelImportServiceTest {

    public final static String TEST_EXCEL_FILE_PATH_1 = "excel_import/excel_import_test_04_08_2022.xlsx";

    public final static String TEST_EXCEL_FILE_PATH_2 = "excel_import/Test_02_09_2022.xlsx";

    private ExcelImportService excelImportService;

    private ResourceLoader resourceLoader;

    public static Stream<Arguments> createReadExcelParams() {
        ImportResultDto expectedResult1 = new ImportResultDto();
        expectedResult1.setImportedOrganisations(2);
        expectedResult1.setImportProcess(new ImportProcessDto(0L, ImportType.EXCEL, ImportSource.RNE, ""));

        ImportResultDto expectedResult2 = new ImportResultDto();
        expectedResult2.setImportedOrganisations(13);
        expectedResult2.setImportProcess(new ImportProcessDto(0L, ImportType.EXCEL, ImportSource.RNE, ""));
        return Stream.of(
                Arguments.of(TEST_EXCEL_FILE_PATH_1, expectedResult1,
                        new OrganisationWorkInProgress[] {ExcelImportTestHelper.getOrga1(),
                                ExcelImportTestHelper.getOrga2()}),
                Arguments.of(TEST_EXCEL_FILE_PATH_2, expectedResult2, new OrganisationWorkInProgress[0])
        );
    }

    @BeforeEach
    void setUp() {
        resourceLoader = new DefaultResourceLoader();
        excelImportService = new ExcelImportService(
                mock(OrganisationWorkInProgressRepository.class),
                mock(ActivityWorkInProgressRepository.class),
                new ExcelImportProperties(),
                new OrganisationWorkInProgressImportValidator(
                        mock(OrganisationWorkInProgressRepository.class),
                        mock(OrganisationRepository.class),
                        mock(ContactInviteRepository.class)),
                new ActivityWorkInProgressImportValidator(),
                Clock.systemDefaultZone());
    }

    @MethodSource("createReadExcelParams")
    @ParameterizedTest
    void readExcel(String excelPath, ImportResultDto expectedImportResult, OrganisationWorkInProgress[] expectedOrgs)
            throws ExcelReadException {
        final Resource testResource = resourceLoader.getResource("classpath:" + excelPath);
        ImportProcess importProcess = new ImportProcess();
        final List<OrganisationWorkInProgress> result = excelImportService
                .importOrganisationAndActivityWorkInProgressFromExcelFile(testResource, importProcess);

        assertThat(result).hasSize(expectedImportResult.getImportedOrganisations());
        assertThat(importProcess.getImportExceptions()).hasSize(
                expectedImportResult.getImportProcess().getImportExceptions().size());
        assertThat(importProcess.getImportWarnings()).hasSize(
                expectedImportResult.getImportProcess().getImportWarnings().size());

        for (int i = 0; i < expectedOrgs.length; i++) {
            ExcelImportTestHelper.compareOrganisationValues(expectedOrgs[i], result.get(i));
        }
    }
}
