package com.exxeta.wpgwn.wpgwnapp.utils.converter;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Objects;

import org.mapstruct.Mapper;

@Mapper
public interface DateMapper {

    default OffsetDateTime convert(Instant instant) {
        if (Objects.isNull(instant)) {
            return null;
        }

        return OffsetDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    default Instant map(OffsetDateTime value) {
        if (Objects.isNull(value)) {
            return null;
        }
        return value.toInstant();
    }

}
