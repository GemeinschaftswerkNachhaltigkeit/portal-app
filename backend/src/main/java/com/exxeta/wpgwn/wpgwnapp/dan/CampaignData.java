package com.exxeta.wpgwn.wpgwnapp.dan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CampaignData {
    private String id;
    private String latitude;
    private String longitude;
    private String category;
    private String aimed;
    private String venue;
    private String name;
    private String introtext;
    private String detailtext;
    private String organizer;
    private String organizerEmail;
    private String organizerTel;
    private String organizerWebsite;
    private ImagesData images;
    private String link;
    private String dateStart;
    private String dateEnd;
}
