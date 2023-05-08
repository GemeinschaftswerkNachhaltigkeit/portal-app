package com.exxeta.wpgwn.wpgwnapp.excel_import;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.exxeta.wpgwn.wpgwnapp.excel_import.domain.ImportProcess;
import com.exxeta.wpgwn.wpgwnapp.excel_import.dto.ImportProcessDto;
import com.exxeta.wpgwn.wpgwnapp.shared.SharedMapper;
import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {DateMapper.class, SharedMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface ImportProcessMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    ImportProcess importProcessDtoToEntity(ImportProcessDto importProcessDto);

    ImportProcessDto importProcessToDto(ImportProcess importProcess);
}
