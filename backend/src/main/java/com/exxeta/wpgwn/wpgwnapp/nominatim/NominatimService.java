package com.exxeta.wpgwn.wpgwnapp.nominatim;

import com.exxeta.wpgwn.wpgwnapp.nominatim.dto.NominatimDto;

import com.github.benmanes.caffeine.cache.Cache;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.apache.commons.codec.digest.DigestUtils.md5Hex;
import static org.springframework.util.StringUtils.hasText;

@Service
@RequiredArgsConstructor
public class NominatimService {


    private final Cache<String, NominatimDto> nominatimCache;

    private final NominatimClient nominatimClient;


    public NominatimDto searchAddress(String address, String lat, String lon) {

        String searchKey = generateSearchKey(address, lat, lon);

        NominatimDto nominatimDto = nominatimCache.getIfPresent(searchKey);

        if (nonNull(nominatimDto)) {
            return nominatimDto;
        }

        if (hasText(address)) {
            List<NominatimDto> nominatimDtos = nominatimClient.getNominatim(address.toLowerCase());
            //Nominatim API Limit: 1 request pro 1s
            sleep();
            if (!CollectionUtils.isEmpty(nominatimDtos)) {
                nominatimDto = nominatimDtos.get(0);
            }
        }

        if (isNull(nominatimDto)) {
            nominatimDto = nominatimClient.getNominatim(lat, lon);
        }

        if (nonNull(nominatimDto)) {
            nominatimCache.put(searchKey, nominatimDto);
        }

        return nominatimDto;
    }

    private String generateSearchKey(String address, String lat, String lon) {
        StringBuilder searchKeyBuilder = new StringBuilder();
        if (hasText(address)) {
            searchKeyBuilder.append(address.trim().toLowerCase());
        }
        if (hasText(lat)) {
            searchKeyBuilder.append("|lat:").append(lat);
        }
        if (hasText(lon)) {
            searchKeyBuilder.append("|lon:").append(lon);
        }
        return md5Hex(searchKeyBuilder.toString());
    }

    @SneakyThrows
    @SuppressWarnings("MagicNumber")
    private void sleep() {
        int randomNumber = ThreadLocalRandom.current().nextInt(1001, 1500);
        Thread.sleep(randomNumber);
    }
}
