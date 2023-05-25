package com.exxeta.wpgwn.wpgwnapp.dan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dan-management")
public class DanController {

    @Autowired
    private DanService danService;
    private String path = "/Users/marco/Downloads/xml_2022-10-10.xml";

    @GetMapping("/Test")
    public ResponseEntity danTest() {
        String body = "";
        body = danService.importXMLFromFile(path).get(0).toString();
        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}
