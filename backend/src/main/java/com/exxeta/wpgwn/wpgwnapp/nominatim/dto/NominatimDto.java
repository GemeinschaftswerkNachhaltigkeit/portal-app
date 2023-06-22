package com.exxeta.wpgwn.wpgwnapp.nominatim.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import static java.util.Objects.nonNull;
import static org.springframework.util.StringUtils.hasText;

@Data
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public final class NominatimDto {

    /**
     * The address longitude.
     */
    @JsonProperty("lon")
    private Double longitude;

    /**
     * The address latitude.
     */
    @JsonProperty("lat")
    private Double latitude;

    @JsonProperty("address")
    private AddressDto address;

    @JsonIgnore
    public String getCity() {
        return nonNull(address)
                ? hasText(address.getCity()) ? address.getCity()
                : hasText(address.getTown()) ? address.getTown()
                : hasText(address.getMunicipality()) ? address.getMunicipality()
                : hasText(address.getState()) ? address.getState()
                : ""
                : "";
    }

    @Getter
    @Setter
    @ToString
    public static class AddressDto {
        @JsonProperty("road")
        private String road;
        @JsonProperty("city")
        private String city;
        @JsonProperty("postcode")
        private String postCode;
        @JsonProperty("house_number")
        private String houseNumber;
        @JsonProperty("state")
        private String state;
        @JsonProperty("town")
        private String town;
        @JsonProperty("municipality")
        private String municipality;
        @JsonProperty("country")
        private String country;
    }

}
