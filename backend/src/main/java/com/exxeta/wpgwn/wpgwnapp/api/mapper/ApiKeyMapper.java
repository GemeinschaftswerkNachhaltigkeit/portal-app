package com.exxeta.wpgwn.wpgwnapp.api.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.api.auth.model.ApiKey;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiKeyDto;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR, uses = DateMapper.class)
public interface ApiKeyMapper {

    ApiKeyDto mapToDto(ApiKey apiKey);

}
