package com.exxeta.wpgwn.wpgwnapp.ui_properties;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UiPropertiesMapper {

    UiConfigPropertiesDto map(UiConfigProperties properties);

}
