package com.exxeta.wpgwn.wpgwnapp.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;

import lombok.experimental.UtilityClass;

/**
 * Utility-Klasse für das Einlesen von Dateien, um deren Inhalte in Testfällen zu nutzen (z.B. Eingangs- oder Ausgangsvergleiche)
 *
 * @author siegerte
 */
@UtilityClass
public class FileUtils {

    private final ResourceLoader DEFAULT_RESOURCE_LOADER = new DefaultResourceLoader();

    /**
     * Einlesen der Datei mit dem übergebenen Pfad und Rückgabe der Inhalte als String.
     * Die Datei muss {@link StandardCharsets UTF8} codiert sein.
     *
     * @param filePath Pfad zu der Datei
     * @return Den Inhalt der Datei als String
     * @throws IOException Falls Fehler beim Lesen der Datei auftreten, z.B. wenn die Datei nicht gefunden werden kann.
     */
    public String readJsonData(String filePath) throws IOException {
        return new String(readBytes(filePath), StandardCharsets.UTF_8);
    }

    /**
     * Einlesen der Datei mit dem übergebenen Pfad und Rückgabe der Inhalte als byte array.
     *
     * @param filePath Pfad zu der Datei
     * @return Den Inhalt der Datei als byte array
     * @throws IOException Falls Fehler beim Lesen der Datei auftreten, z.B. wenn die Datei nicht gefunden werden kann.
     */
    public byte[] readBytes(String filePath) throws IOException {
        return DEFAULT_RESOURCE_LOADER.getResource(filePath).getInputStream().readAllBytes();
    }

    /**
     * Lädt den Inhalt der Datei des übergebenen Pfads als String.
     *
     * @param filePath Datepfad
     * @return Inhalt der Datei als String
     * @throws IOException wenn ein Fehler beim Lesen der Datei aufgetreten ist
     */
    public String readStringData(String filePath) throws IOException {
        return new String(readBytes(filePath), StandardCharsets.UTF_8);
    }

    /**
     * Lädt den Inhalt der Datei des übergebenen Pfads und ersetzt zusammenhängende Zeilenumbrüche, Tabs oder Leerzeichen mit einem einzigen Leerzeichen.<br>
     * Beispiel:<br>
     * <pre>lorem  ipsum   dolor \n sit.</pre>
     * wird zu<br>
     * {@code lorem ipsum dolor sit.}
     *
     * @param filePath Dateipfad
     * @return String ohne Zeilenumbrüche
     * @throws IOException wenn ein Fehler beim Lesen der Datei aufgetreten ist
     */
    public String readStringDataAndRemoveLineBreaks(String filePath) throws IOException {
        final String fileContent = readStringData(filePath);

        return removeLineBreaks(fileContent);
    }

    /**
     * Ersetzt zusammenhängende Zeilenumbrüche, Tabs oder Leerzeichen mit einem einzigen Leerzeichen.<br>
     * Beispiel:<br>
     * <pre>lorem  ipsum   dolor \n sit.</pre>
     * wird zu<br>
     * {@code lorem ipsum dolor sit.}
     *
     * @param text String
     * @return String ohne Zeilenumbrüche
     */
    public String removeLineBreaks(String text) {
        return text.replaceAll("\\s+", " ").trim();
    }

}

