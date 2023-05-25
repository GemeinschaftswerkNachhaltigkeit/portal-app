package com.exxeta.wpgwn.wpgwnapp.dan;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class DanDataList {
    @Getter
    @Setter
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "campaign")
    private List<CampaignData> campaigns;
}
