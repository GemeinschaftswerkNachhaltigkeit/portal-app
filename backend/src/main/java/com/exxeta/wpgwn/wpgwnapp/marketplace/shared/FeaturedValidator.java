package com.exxeta.wpgwn.wpgwnapp.marketplace.shared;

import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace.model.MarketplaceItem;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.dto.OfferWorkInProgressRequestDto;
import com.exxeta.wpgwn.wpgwnapp.marketplace.marketplace_work_in_progress.model.MarketplaceWorkInProgress;
import com.exxeta.wpgwn.wpgwnapp.security.PermissionPool;

@Component
public class FeaturedValidator {

    public void checkFeaturedPermission(@NonNull OAuth2AuthenticatedPrincipal principal,
                                        @NonNull OfferWorkInProgressRequestDto offerWorkInProgressRequestDto) {
        if (Boolean.TRUE.equals(offerWorkInProgressRequestDto.getFeatured())
                || StringUtils.hasText(offerWorkInProgressRequestDto.getFeaturedText())) {
            if (!principal.getAuthorities()
                    .contains(new SimpleGrantedAuthority("ROLE_" + PermissionPool.MARKETPLACE_FEATURE))) {
                throw new AccessDeniedException("User does not have permission to edit feature flag");
            }
        }
    }

    public void checkFeaturedPermission(@NonNull OAuth2AuthenticatedPrincipal principal,
                                        @NonNull MarketplaceWorkInProgress marketplaceWorkInProgress) {
        if (Boolean.TRUE.equals(marketplaceWorkInProgress.getFeatured())
                || StringUtils.hasText(marketplaceWorkInProgress.getFeaturedText())) {
            if (!principal.getAuthorities()
                    .contains(new SimpleGrantedAuthority("ROLE_" + PermissionPool.MARKETPLACE_FEATURE))) {
                throw new AccessDeniedException("User does not have permission to edit feature flag");
            }
        }
    }

    public void checkFeaturedPermission(@NonNull OAuth2AuthenticatedPrincipal principal,
                                        @NonNull MarketplaceItem marketplaceItem) {
        if (Boolean.TRUE.equals(marketplaceItem.getFeatured())
                || StringUtils.hasText(marketplaceItem.getFeaturedText())) {
            if (!principal.getAuthorities()
                    .contains(new SimpleGrantedAuthority("ROLE_" + PermissionPool.MARKETPLACE_FEATURE))) {
                throw new AccessDeniedException("User does not have permission to edit feature flag");
            }
        }
    }

}
