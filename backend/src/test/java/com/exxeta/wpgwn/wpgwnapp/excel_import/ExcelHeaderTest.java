package com.exxeta.wpgwn.wpgwnapp.excel_import;

import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import static org.assertj.core.api.Assertions.assertThat;

class ExcelHeaderTest {

    @MethodSource("createTestCases")
    @ParameterizedTest
    void isValidUrl(String url, Boolean expectedResult) {
        assertThat(ExcelHeader.isValidUrl(url)).isEqualTo(expectedResult);
    }

    public static Stream<Arguments> createTestCases() {
        return Stream.of(
                Arguments.of("www.test.de", false),
                Arguments.of("https://test.de", true),
                Arguments.of("http://test.de", true),
                Arguments.of("http://test.de/mein-link-zum-facebook", true),
                Arguments.of("facebookHandle", false),
                Arguments.of("http://facebookHandle", true)
        );
    }

}
