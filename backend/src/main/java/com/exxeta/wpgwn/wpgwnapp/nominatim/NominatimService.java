package com.exxeta.wpgwn.wpgwnapp.nominatim;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

import com.exxeta.wpgwn.wpgwnapp.nominatim.dto.NominatimDto;

import com.github.benmanes.caffeine.cache.Cache;

import static java.util.Objects.nonNull;
import static org.apache.commons.codec.digest.DigestUtils.md5Hex;

@Service
@RequiredArgsConstructor
public class NominatimService {


    private final Cache<String, NominatimDto> nominatimCache;

    private final NominatimClient nominatimClient;


    public NominatimDto searchAddress(String address) {

        String queryAddress = address.trim().toLowerCase();
        String searchKey = md5Hex(queryAddress);

        NominatimDto nominatimDto = nominatimCache.getIfPresent(searchKey);

        if (nonNull(nominatimDto)) {
            return nominatimDto;
        }
        List<NominatimDto> nominatimDtos = nominatimClient.getNominatim(queryAddress);

        //Nominatim API Limit: 1 request pro 1s
        sleep();

        if (!CollectionUtils.isEmpty(nominatimDtos)) {
            nominatimDto = nominatimDtos.get(0);
            nominatimCache.put(searchKey, nominatimDto);
            return nominatimDto;
        }
        return null;
    }

    @SneakyThrows
    @SuppressWarnings("MagicNumber")
    private void sleep() {
        int randomNumber = ThreadLocalRandom.current().nextInt(1001, 1500);
        Thread.sleep(randomNumber);
    }
}
