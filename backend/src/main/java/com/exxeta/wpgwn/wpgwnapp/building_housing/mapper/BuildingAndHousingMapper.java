package com.exxeta.wpgwn.wpgwnapp.building_housing.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.building_housing.dto.BuildingAndHousingContactFormDto;
import com.exxeta.wpgwn.wpgwnapp.building_housing.mapper.model.BuildingAndHousingContact;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class BuildingAndHousingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    public abstract BuildingAndHousingContact mapperBuildingAndHousing(
            BuildingAndHousingContactFormDto buildingAndHousingContactFormDto);

    public abstract BuildingAndHousingContactFormDto buildingAndHousingContactToDto(BuildingAndHousingContact savedBuildingAndHousingContact);
}
