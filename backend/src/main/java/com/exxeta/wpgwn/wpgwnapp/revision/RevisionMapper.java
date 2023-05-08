package com.exxeta.wpgwn.wpgwnapp.revision;

import java.util.function.Function;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.history.Revision;
import org.springframework.data.history.RevisionMetadata;

import com.exxeta.wpgwn.wpgwnapp.utils.converter.DateMapper;

@Mapper(uses = {DateMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface RevisionMapper {

    @Mapping(target = "revisionNumber", source = "requiredRevisionNumber")
    @Mapping(target = "modifiedAt", source = "requiredRevisionInstant")
    @Mapping(target = "revisionType", source = "revisionType")
    RevisionMetadataDto map(RevisionMetadata<Long> revisionMetadata);

    default <S, T> RevisionDto<T> mapRevision(Revision<Long, S> revision, Function<S, T> dtoMapper) {
        return new RevisionDto<>(map(revision.getMetadata()), dtoMapper.apply(revision.getEntity()));
    }

}
