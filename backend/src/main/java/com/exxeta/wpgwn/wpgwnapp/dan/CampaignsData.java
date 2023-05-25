package com.exxeta.wpgwn.wpgwnapp.dan;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CampaignsData {
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<CampaignData> campaign;
}
