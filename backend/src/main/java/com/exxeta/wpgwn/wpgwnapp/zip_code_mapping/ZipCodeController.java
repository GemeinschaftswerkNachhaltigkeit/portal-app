package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import javax.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/zip-codes")
@RequiredArgsConstructor
public class ZipCodeController {

    private final ZipCodeService zipCodeService;

    private final ZipCodeMapper zipCodeMapper;

    @GetMapping("/{zip-code}")
    ZipCodeDto getZipCodeInfo(@PathVariable("zip-code") String zipCode) {
        return zipCodeService.get(zipCode)
                .map(zipCodeMapper::map)
                .orElseThrow(() -> new EntityNotFoundException("No zip code information found for [" + zipCode + "]"));
    }

}
