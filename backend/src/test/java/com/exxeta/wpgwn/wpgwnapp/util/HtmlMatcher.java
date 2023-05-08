package com.exxeta.wpgwn.wpgwnapp.util;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.stream.StreamSupport;

import org.hamcrest.Description;
import org.hamcrest.TypeSafeMatcher;
import org.springframework.util.StringUtils;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.diff.Comparison;
import org.xmlunit.diff.DefaultComparisonFormatter;
import org.xmlunit.diff.Diff;
import org.xmlunit.diff.Difference;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertAll;

/**
 * Matcher, der zwei Strings vergleicht, die eine Html-Struktur enthalten (XML-Struktur, um genau zu sein).
 * Im Fehlerfall werden die einzelnen Diffs so ausgegeben, dass sie isoliert im Diff-Viewer von IntelliJ betrachtet werden können.
 *
 * <p>
 * Copyright: Copyright (c) 16.12.2021<br/>
 * Organisation: EXXETA AG
 *
 * @author Jan Buchholz <a href="mailto:jan.buchholz@exxeta.com">jan.buchholz@exxeta.com</a>
 */
public final class HtmlMatcher extends TypeSafeMatcher<String> {
    private final String expected;

    private HtmlMatcher(String expected) {
        assertThat("Expected html must not be empty", !StringUtils.hasText(expected), is(equalTo(false)));
        this.expected = expected;
    }

    /**
     * Erstellt einen Matcher und vergleicht mit dem übergebenen erwarteten Html-Input
     *
     * @param expected Html-Input, gegen den gematcht wird
     * @return HtmlMatcher
     */
    public static HtmlMatcher htmlEqualTo(String expected) {
        return new HtmlMatcher(expected);
    }

    /**
     * Erstellt einen Matcher und vergleicht mit der übergebenen Html-Datei
     *
     * @param expectedFilePath Pfad zur Vergleichs-Datei
     * @return HtmlMatcher
     * @throws IOException falls die Datei nicht geladen werden kann
     */
    public static HtmlMatcher htmlEqualToFile(String expectedFilePath) throws IOException {
        return htmlEqualToFile(expectedFilePath, Collections.emptyMap());
    }

    public static HtmlMatcher htmlEqualToFile(String expectedFilePath, Map<String, String> args) throws IOException {
        String expectedContent = FileUtils.readStringData(expectedFilePath);
        if (!args.isEmpty()) {
            for (Map.Entry<String, String> e: args.entrySet()) {
                expectedContent = expectedContent.replace(e.getKey(), e.getValue());
            }
        }
        return new HtmlMatcher(expectedContent);
    }

    @Override
    protected boolean matchesSafely(String actual) {
        assertThat("Actual html must not be empty! Expected was: " + expected, !StringUtils.hasText(actual), is(equalTo(false)));

        // Diff generieren, Whitespaces/Zeilenumbrüche und Kommentare werden ignoriert
        final Diff diff = DiffBuilder.compare(expected).withTest(actual).normalizeWhitespace().ignoreComments().build();

        /*
         Falls es Unterschiede gibt, diese jeweils explizit asserten.
         Jede dieser Assertions wird failen (naheliegend), generiert aber eine schöne Fehlermeldung
         (die z.B. im IntelliJ im Diff-Viewer dargestellt werden kann).
         */
        assertAll(StreamSupport.stream(diff.getDifferences().spliterator(), false).map(Difference::getComparison)
                .map(CustomComparisonFormatter::new)
                .map(formatter -> () -> assertThat(formatter.getActual(), is(equalTo(formatter.getExpected())))));
        return true;
    }

    @Override
    public void describeTo(Description description) {
        // Description wird über genutzte Matcher implementiert
    }

    /**
     * Wir nutzen diesen Formatter an dieser Stelle, um an die Protected-Methoden des Parent zu kommen,
     * über die wir bequem an die zu übergebenden Werte kommen.
     */
    private static class CustomComparisonFormatter extends DefaultComparisonFormatter {

        private final Comparison difference;

        public CustomComparisonFormatter(Comparison difference) {
            this.difference = difference;
        }

        String getExpected() {
            final Comparison.Detail controlDetails = difference.getControlDetails();
            return getShortString(controlDetails.getTarget(), controlDetails.getXPath(), difference.getType());
        }

        String getActual() {
            final Comparison.Detail controlDetails = difference.getTestDetails();
            return getShortString(controlDetails.getTarget(), controlDetails.getXPath(), difference.getType());
        }
    }
}
