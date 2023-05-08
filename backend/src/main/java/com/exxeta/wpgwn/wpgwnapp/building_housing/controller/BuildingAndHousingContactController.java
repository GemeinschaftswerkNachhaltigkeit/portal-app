package com.exxeta.wpgwn.wpgwnapp.building_housing.controller;


import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.BuildingAndHousingContactFormDto;
import com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.model.BuildingAndHousingContact;
import com.exxeta.wpgwn.wpgwnapp.building_housing.service.BuildingAndHousingContactService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/public/v1/building-housing-contact-form")
@RequiredArgsConstructor
public class BuildingAndHousingContactController {

    private final BuildingAndHousingContactService contactService;

    @PostMapping
    public void createBuildingAndHousingContact(
            @Valid @RequestBody BuildingAndHousingContactFormDto requestDto) {

        contactService.loadStationDescription(requestDto);

        if (!contactService.isContactRegistered(requestDto.getUniqueHash())) {
            BuildingAndHousingContact buildingAndHousingContact = contactService.save(requestDto);
            contactService.sendNotificationToAdmin(buildingAndHousingContact);
            contactService.sendNotificationToUser(buildingAndHousingContact);
        }

    }
}
