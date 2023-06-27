package com.exxeta.wpgwn.wpgwnapp.dan_import.xml;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Campaigns {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "campaign")
    private List<Campaign> campaigns;
}
