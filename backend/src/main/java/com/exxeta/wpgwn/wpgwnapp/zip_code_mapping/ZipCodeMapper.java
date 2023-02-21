package com.exxeta.wpgwn.wpgwnapp.zip_code_mapping;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ZipCodeMapper {

    ZipCodeDto map(ZipCode zipCode);

}
