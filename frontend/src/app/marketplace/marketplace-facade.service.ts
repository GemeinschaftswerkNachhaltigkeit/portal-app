import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, Observable, take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { RegisterOrLoginService } from '../core/services/register-or-login.service.service';
import { DynamicFilters } from '../map/map/models/search-filter';
import Paging from '../shared/models/paging';
import { LoadingService } from '../shared/services/loading.service';
import { PersistFiltersService } from '../shared/services/persist-filters.service';
import { MarketplaceApiService } from './api/marketplace-api.service';
import { PartnerLinksContentService } from './api/partner-links-content.service';
import { MarketplaceItemDto } from './models/marketplace-item-dto';
import { PartnerLink } from './models/partner-link';
import { MarketplaceStateService } from './state/marketplace-state.service';
import { PartnerLinksStateService } from './state/partner-links-state.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceFacadeService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoadingService,
    private translate: TranslateService,
    private marketplaceState: MarketplaceStateService,
    private marketplaceApi: MarketplaceApiService,
    private persistFilters: PersistFiltersService,
    private partnerLinksContentSevice: PartnerLinksContentService,
    private partnerLinksState: PartnerLinksStateService,
    private registerOrLogin: RegisterOrLoginService,
    private auth: AuthService
  ) {
    this.triggerSearchOnQueryParamsChange();
    this.handlePartnerLinkContent();
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const params = this.route.snapshot.queryParams;
        if (params['add']) {
          this.finalizeAddNewMarketplaceItem();
        }
      });
  }

  handlePartnerLinkContent(): void {
    this.translate.onLangChange.subscribe(() => {
      this.loadPartnerLinks();
    });
    this.loadPartnerLinks();
  }

  get marketplaceItems$(): Observable<MarketplaceItemDto[] | null> {
    return this.marketplaceState.marketplaceItems$;
  }
  get featuredMarketplaceItems$(): Observable<MarketplaceItemDto[] | null> {
    return this.marketplaceState.featuredMarketplaceItems$;
  }

  get marketplaceItemsPaging$(): Observable<Paging> {
    return this.marketplaceState.marketplaceItemsPaging$;
  }

  get item$(): Observable<MarketplaceItemDto | null> {
    return this.marketplaceState.marketplaceItem$;
  }

  get partnerLinks$(): Observable<PartnerLink[]> {
    return this.partnerLinksState.parnterLinks$;
  }

  search(searchFilter: DynamicFilters): void {
    const existingFilters = this.getFilters();
    const filters = {
      ...existingFilters,
      ...searchFilter
    };
    this.persistFilters.setFiltersToUrl(filters);
  }

  getFeatured(): void {
    this.loader.start('featured-marketplace');
    this.marketplaceApi
      .getFeatured()
      .pipe(take(1))
      .subscribe({
        next: (pagedItems) => {
          this.marketplaceState.setFeaturedMarketplaceItemsResponse(pagedItems);
          this.loader.stop('featured-marketplace');
        },
        error: () => {
          this.loader.stop('featured-marketplace');
        }
      });
  }

  clearFilters(): void {
    this.persistFilters.setFiltersToUrl({});
  }

  changePage(page: number, size: number): void {
    this.search({ page: page, size: size });
  }

  getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl([
      'thematicFocus',
      'offerCat',
      'bestPractiseCat'
    ]);
  }

  countFilters(): number {
    const filters = this.getFilters();
    const selectedThematicFocusValues = filters
      ? (filters['thematicFocus'] as string[])
      : [];
    const selectedOfferCatValues = filters
      ? (filters['offerCat'] as string[])
      : [];
    const selectedBestPracticeValues = filters
      ? (filters['bestPractiseCat'] as string[])
      : [];

    const focus = selectedThematicFocusValues
      ? selectedThematicFocusValues.length
      : 0;
    const offers = selectedOfferCatValues ? selectedOfferCatValues.length : 0;
    const bestPracts = selectedBestPracticeValues
      ? selectedBestPracticeValues.length
      : 0;
    const query = filters['query'] ? 1 : 0;

    return focus + offers + bestPracts + query;
  }

  loadItem(id: number): void {
    this.loader.start('load-marketplace-item');
    this.marketplaceApi
      .getMarketplaceItem(id)
      .pipe(take(1))
      .subscribe({
        next: (item: MarketplaceItemDto) => {
          this.marketplaceState.setMarketplaceItemResponse(item);
          this.loader.stop('load-marketplace-item');
        },
        error: () => {
          this.loader.stop('load-marketplace-item');
        }
      });
  }

  private triggerSearchOnQueryParamsChange(): void {
    this.route.queryParamMap.subscribe(() => {
      const filters = this.getFilters();
      this.loader.start('search-marketplace');

      this.marketplaceApi
        .search(filters)
        .pipe(take(1))
        .subscribe({
          next: (pagedItems) => {
            this.marketplaceState.setMarketplaceItemsResponse(pagedItems);
            this.loader.stop('search-marketplace');
          },
          error: () => {
            this.loader.stop('search-marketplace');
          }
        });
    });
  }

  loadPartnerLinks(): void {
    this.partnerLinksContentSevice
      .getPartnerLinks()
      .pipe(take(1))
      .subscribe((values) => {
        this.partnerLinksState.setPartnerLinks(values);
      });
  }

  addNewMarketplaceItem(): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeAddNewMarketplaceItem();
    } else {
      this.registerOrLogin.open({
        title: this.translate.instant('marketplace.titles.addLoginModal'),
        subtitle: this.translate.instant('marketplace.texts.addLoginModal'),
        next: `${this.router.url}?add=true`
      });
    }
  }

  finalizeAddNewMarketplaceItem(): void {
    const hasOrga = this.auth.userHasOrga();
    if (hasOrga) {
      this.router.navigate(['/', 'account']);
    }
    if (!hasOrga) {
      this.router.navigate(['/', 'account', 'my-organisation']);
    }
  }
}
