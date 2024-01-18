package com.exxeta.wpgwn.wpgwnapp.dan_import;

import jakarta.annotation.security.RolesAllowed;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlJobEvent;
import com.exxeta.wpgwn.wpgwnapp.dan_import.dto.ImportDanXmlProcessDto;
import com.exxeta.wpgwn.wpgwnapp.dan_import.service.ImportDanXmlService;
import com.exxeta.wpgwn.wpgwnapp.dan_import.xml.Campaigns;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

import static com.exxeta.wpgwn.wpgwnapp.dan_import.domain.ImportStatus.TODO;
import static org.springframework.http.MediaType.APPLICATION_XML_VALUE;

@RestController
@RequestMapping("/api/v1/dan-import")
@RequiredArgsConstructor
public class ImportDanController {

    private final ImportDanXmlService importDanXmlService;

    private final ApplicationEventPublisher eventPublisher;

    private final Clock clock;

    /**
     * find all Import
     *
     * @return list
     */
    @RolesAllowed(PermissionPool.RNE_ADMIN)
    @GetMapping("")
    public List<ImportDanXmlProcessDto> findAllImport() {
        return importDanXmlService.findAllDanImport();
    }

    /**
     * find by importId
     *
     * @param importId
     * @return ImportDanXmlProcessDto
     */
    @RolesAllowed(PermissionPool.RNE_ADMIN)
    @GetMapping("/{importId}")
    public ImportDanXmlProcessDto findByImportId(@PathVariable("importId") String importId) {
        return importDanXmlService.findByImportId(importId);
    }

    /**
     * Import Dan from rest api
     *
     * @param campaigns
     * @return importDanXmlProcessDto
     */
    @Transactional
    @RolesAllowed(PermissionPool.RNE_ADMIN)
    @PostMapping(value = "/xml", produces = {APPLICATION_XML_VALUE})
    public ImportDanXmlProcessDto importDanAsRequestBody(@RequestBody Campaigns campaigns) {
        String filename = Instant.now(clock) + "XML_REQUEST_PER_REST_API";
        String importKey = UUID.randomUUID().toString();
        return asyncImportXml(campaigns, filename, importKey);
    }

    /**
     * Import Dan from xml file
     *
     * @param xmlFile
     * @return importDanXmlProcessDto
     */
    @Transactional
    @RolesAllowed(PermissionPool.RNE_ADMIN)
    @PostMapping("/file")
    public ImportDanXmlProcessDto importDan(@RequestParam("xmlFile") MultipartFile xmlFile) {
        Campaigns campaigns = importDanXmlService.loadXmlFromFile(xmlFile);
        String importKey = UUID.randomUUID().toString();
        return asyncImportXml(campaigns, xmlFile.getOriginalFilename(), importKey);
    }

    /**
     * init async ImportJob
     *
     * @param campaigns XML Object
     * @param filename  Filename
     * @param importKey
     * @return importDanXmlProcessDto
     */
    private ImportDanXmlProcessDto asyncImportXml(Campaigns campaigns, String filename, String importKey) {
        eventPublisher.publishEvent(new ImportDanXmlJobEvent(filename, TODO, importKey, campaigns));
        return new ImportDanXmlProcessDto(filename, TODO, importKey);
    }

}
