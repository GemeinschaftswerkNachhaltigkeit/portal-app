package com.exxeta.wpgwn.wpgwnapp.nominatim;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.exxeta.wpgwn.wpgwnapp.nominatim.dto.NominatimDto;

@FeignClient(name = "nominatim-client", url = "${nominatim.url}")
public interface NominatimClient {

    @RequestMapping(method = RequestMethod.GET, value = "")
    List<NominatimDto> getNominatim(@RequestParam("q") String address,
                                    @RequestParam("format") String format,
                                    @RequestParam("addressdetails") String addressDetails,
                                    @RequestParam("limit") String limit,
                                    @RequestParam("accept-language") String language);


    default List<NominatimDto> getNominatim(String address) {
        return this.getNominatim(address, "jsonv2", "1", "1", "de-DE");
    }

}
