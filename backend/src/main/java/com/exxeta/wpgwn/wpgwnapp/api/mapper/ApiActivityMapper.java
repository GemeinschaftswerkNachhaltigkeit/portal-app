package com.exxeta.wpgwn.wpgwnapp.api.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.activity.model.Activity;
import com.exxeta.wpgwn.wpgwnapp.api.dto.ApiActivityResponseDto;
import com.exxeta.wpgwn.wpgwnapp.shared.ImageMapper;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class, ImageMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface ApiActivityMapper {

    ApiActivityResponseDto activityToDto(Activity organisation);

}
