package com.exxeta.wpgwn.wpgwnapp.utils.converter;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Envelope;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("MagicNumber")
public class StringToEnvelope implements Converter<String, Envelope> {

    @Override
    public Envelope convert(@NonNull String source) {
        String[] stringArray = StringUtils.split(source, ",", -1);

        if (Objects.isNull(stringArray) || stringArray.length != 4) {
            throw new IllegalArgumentException("Unable to convert ["
                    + source + "] to Envelope");
        }

        List<Double> vars = Stream.of(stringArray)
                .map(String::trim)
                .map(Double::parseDouble)
                .collect(Collectors.toUnmodifiableList());

        return new Envelope(new Coordinate(vars.get(1), vars.get(0)), new Coordinate(vars.get(3), vars.get(2)));
    }
}
