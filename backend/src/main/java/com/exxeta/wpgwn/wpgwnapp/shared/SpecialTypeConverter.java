package com.exxeta.wpgwn.wpgwnapp.shared;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.shared.dto.SpecialTypeDto;

import static org.springframework.util.StringUtils.hasText;

@Component
@Slf4j
public class SpecialTypeConverter implements Converter<String, SpecialTypeDto> {

    @Override
    public SpecialTypeDto convert(String value) {
        if (!hasText(value)) {
            log.warn("Provided value is null or empty. Defaulting to EVENT.");
            return SpecialTypeDto.EVENT;
        }

        try {
            return SpecialTypeDto.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Provided value [{}] is not a valid SpecialTypeDto. Defaulting to EVENT.", value, e);
            return SpecialTypeDto.EVENT;
        }
    }
}
