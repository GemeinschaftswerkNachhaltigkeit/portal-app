package com.exxeta.wpgwn.wpgwnapp.dan_import.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ImportDanXmlResult {

    private List<String> imported = new ArrayList<>();

    private List<String> updated = new ArrayList<>();

    private List<ImportResult> ignored = new ArrayList<>();

    private List<ImportResult> cancelled = new ArrayList<>();

    public void addImported(String importedDanId) {
        this.imported.add(importedDanId);
    }

    public void addUpdated(String updatedDanId) {
        this.updated.add(updatedDanId);
    }

    public void addIgnored(String danId, String reason) {
        this.ignored.add(new ImportResult(danId, reason));
    }

    public void addCancelled(String danId, String reason) {
        this.cancelled.add(new ImportResult(danId, reason));
    }

    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportResult {

        private String id;

        private String reason;
    }
}
