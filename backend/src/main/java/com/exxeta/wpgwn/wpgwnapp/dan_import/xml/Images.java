package com.exxeta.wpgwn.wpgwnapp.dan_import.xml;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@Getter
@Setter
@ToString
public class Images {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "image")
    private List<String> image;
}
