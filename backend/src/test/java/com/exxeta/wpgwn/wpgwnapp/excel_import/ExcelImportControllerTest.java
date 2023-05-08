package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import com.exxeta.wpgwn.wpgwnapp.TestSecurityConfiguration;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.activity_work_in_progress.ActivityWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportSource;
import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportResultDto;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.organisation_work_in_progress.OrganisationWorkInProgressRepository;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import({TestSecurityConfiguration.class})
@SpringBootTest
@AutoConfigureMockMvc
class ExcelImportControllerTest {

    public final static String TEST_EXCEL_FILE_PATH = "excel_import/excel_import_test_04_08_2022.xlsx";

    private static final String BASE_API_URL = "/api/v1/import/excel";

    @Autowired
    private ImportProcessRepository importProcessRepository;
    @Autowired
    private OrganisationWorkInProgressRepository organisationWorkInProgressRepository;
    @Autowired
    private ActivityWorkInProgressRepository activityWorkInProgressRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private ObjectMapper objectMapper;

    @WithMockUser(roles = PermissionPool.RNE_ADMIN)
    @Transactional
    @Test
    void importOrganisations() throws Exception {

        final Resource testResource = resourceLoader.getResource("classpath:" + TEST_EXCEL_FILE_PATH);
        String originalFileName = testResource.getFilename();
        String contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        byte[] content = StreamUtils.copyToByteArray(testResource.getInputStream());
        MockMultipartFile file = new MockMultipartFile("file", originalFileName, contentType, content);

        MockHttpServletResponse response =
                mockMvc.perform(MockMvcRequestBuilders.multipart(BASE_API_URL)
                        .file(file)
                        .param("importSource", ImportSource.RNE.toString())
                ).andExpect(status().isOk()).andReturn().getResponse();


        ImportResultDto importResultDto = objectMapper.readValue(response.getContentAsString(), ImportResultDto.class);
        ImportProcess importProcess = importProcessRepository.findById(importResultDto.getImportProcess().getId())
                .orElseThrow(() -> new Exception("No ImportProcess Found"));
        List<OrganisationWorkInProgress> organisationWorkInProgressList =
                organisationWorkInProgressRepository.findAllByImportProcessId(importProcess.getId());
        List<ActivityWorkInProgress> activityWorkInProgressList =
                activityWorkInProgressRepository.findAllByImportProcessId(importProcess.getId());

        assertThat(importResultDto.getImportedOrganisations()).isEqualTo(2);
        assertThat(importResultDto.getImportedActivities()).isEqualTo(1);
        assertThat(importResultDto.getImportProcess().getImportWarnings()).hasSize(0);
        assertThat(importResultDto.getImportProcess().getImportExceptions()).hasSize(0);

        assertThat(organisationWorkInProgressList).hasSize(2);
        OrganisationWorkInProgress organisationWorkInProgress0 = organisationWorkInProgressList.get(0);
        OrganisationWorkInProgress organisationWorkInProgress1 = organisationWorkInProgressList.get(1);
        Set<ActivityWorkInProgress> referencesActivities0 = organisationWorkInProgress0.getActivitiesWorkInProgress();
        Set<ActivityWorkInProgress> referencesActivities1 = organisationWorkInProgress1.getActivitiesWorkInProgress();
        assertThat(Set.of(referencesActivities0.size(), referencesActivities1.size()).containsAll(Set.of(0, 1))).isTrue();
        ActivityWorkInProgress activityWorkInProgress =
                Stream.concat(referencesActivities0.stream(), referencesActivities1.stream()).findFirst().get();
        assertThat(activityWorkInProgress.getId()).isNotNull();

        assertThat(activityWorkInProgressList).hasSize(1);

        OrganisationWorkInProgress expectedOrga1 = ExcelImportTestHelper.getOrga1();
        OrganisationWorkInProgress resultOrga1 = organisationWorkInProgressList.stream()
                .filter(org -> expectedOrga1.getName().equals(org.getName())).findFirst()
                .orElseThrow(() -> new Exception("Org1 not Found"));
        OrganisationWorkInProgress expectedOrga2 = ExcelImportTestHelper.getOrga2();
        OrganisationWorkInProgress resultOrga2 = organisationWorkInProgressList.stream()
                .filter(org -> expectedOrga2.getName().equals(org.getName())).findFirst()
                .orElseThrow(() -> new Exception("Org2 not Found"));

        ExcelImportTestHelper.compareOrganisationValues(expectedOrga1, resultOrga1);
        ExcelImportTestHelper.compareOrganisationValues(expectedOrga2, resultOrga2);
        ExcelImportTestHelper.compareActivityValues(ExcelImportTestHelper.getAct1(), activityWorkInProgressList.get(0));

        assertThat(importProcess).isNotNull();
        assertThat(organisationWorkInProgress0.getImportProcess()).isEqualTo(importProcess);
        assertThat(organisationWorkInProgressList.get(1).getImportProcess()).isEqualTo(importProcess);
        assertThat(activityWorkInProgressList.get(0).getImportProcess()).isEqualTo(importProcess);
    }
}
