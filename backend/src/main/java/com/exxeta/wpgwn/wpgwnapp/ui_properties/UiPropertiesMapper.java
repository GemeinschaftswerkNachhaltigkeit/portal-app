package com.exxeta.wpgwn.wpgwnapp.ui_properties;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UiPropertiesMapper {
    @Mapping(target = "danId", ignore = true)
    UiConfigPropertiesDto map(UiConfigProperties properties);

}
