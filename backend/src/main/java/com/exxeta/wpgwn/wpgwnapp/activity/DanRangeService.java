package com.exxeta.wpgwn.wpgwnapp.activity;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.exxeta.wpgwn.wpgwnapp.activity.dto.DanSetting;
import com.exxeta.wpgwn.wpgwnapp.cms.CmsClient;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDataDto;
import com.exxeta.wpgwn.wpgwnapp.cms.dto.FeatureDto;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("MagicNumber")
public class DanRangeService {

    public static final String DAN_ACCOUNT_KEY = "dan-account";
    public static final String DAN_RANGE_KEY = "dan-range";
    private final CmsClient cmsClient;
    private final Clock clock;

    public void isDanAvailable() {
        Instant now = Instant.now(clock);
        DanSetting danSetting = getDanSetting();
        if (!danSetting.active() || (now.isBefore(danSetting.startEditMin())) || now.isAfter(danSetting.endEditMax())) {
            throw new AccessDeniedException("Dan is not available");
        }
    }

    public DanSetting getDanSetting() {
        try {
            FeatureDataDto featureDataDto = cmsClient.getFeatures();
            List<FeatureDto> features = featureDataDto.getData();

            FeatureDto danAccountFeature = getFeatureByKey(features, DAN_ACCOUNT_KEY);
            FeatureDto danRangeFeature = getFeatureByKey(features, DAN_RANGE_KEY);

            boolean activeEdit = danAccountFeature.isActive();
            LocalDateTime startEdit = danAccountFeature.getStart();
            LocalDateTime endEdit = danAccountFeature.getEnd();

            boolean activeDan = danRangeFeature.isActive();
            LocalDateTime startDan = danRangeFeature.getStart();
            LocalDateTime endDan = danRangeFeature.getEnd();

            return new DanSetting(activeEdit, activeDan, startEdit, endEdit, startDan, endDan);
        } catch (Exception ex) {
            log.error("Load Dan Setting Error: {}", ex);
        }

        return new DanSetting(false, false, null, null, null, null);
    }


    private FeatureDto getFeatureByKey(List<FeatureDto> features, String key) {
        return features.stream()
                .filter(featureDto -> key.equals(featureDto.getFeature()))
                .findFirst()
                .orElse(new FeatureDto());
    }


}
