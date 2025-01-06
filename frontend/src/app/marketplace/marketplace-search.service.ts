import { computed, inject, Injectable, signal } from '@angular/core';
import { MarketplaceItemDto } from './models/marketplace-item-dto';
import PagedResponse from '../shared/models/paged-response';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, Subject, switchMap, tap } from 'rxjs';
import { MarketplaceApiService } from './api/marketplace-api.service';
import { PersistFiltersService } from '../shared/services/persist-filters.service';
import { DynamicFilters } from '../map/models/search-filter';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseError } from '../shared/components/base/error.component';

type MarketplaceSearchState = {
  items: PagedResponse<MarketplaceItemDto> | null;
  featuredItems: PagedResponse<MarketplaceItemDto> | null;
  loading: boolean;
  error: BaseError | null;
};

@Injectable({
  providedIn: 'root'
})
export class MarketplaceSearchService {
  private route = inject(ActivatedRoute);
  private api = inject(MarketplaceApiService);
  private persistFilters = inject(PersistFiltersService);

  private readonly filters = ['thematicFocus', 'offerCat', 'bestPractiseCat'];

  // state
  private state = signal<MarketplaceSearchState>({
    items: null,
    featuredItems: null,
    loading: false,
    error: null
  });

  // subjects
  private fetchFeaturedItems$ = new Subject();

  // selectors
  readonly items = computed(() =>
    this.state().items ? this.state().items?.content : []
  );
  readonly featuredItems = computed(() =>
    this.state().featuredItems ? this.state().featuredItems?.content : []
  );
  readonly paging = computed(() =>
    this.state().items
      ? {
          number: this.state().items?.number,
          size: this.state().items?.size,
          totalElements: this.state().items?.totalElements,
          totalPages: this.state().items?.totalPages
        }
      : null
  );
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor() {
    this.searchItemsOnChangingQueryParams();
  }

  // actions

  search(searchFilter: DynamicFilters): void {
    const existingFilters = this.getFilters();
    const filters = {
      ...existingFilters,
      ...searchFilter
    };
    this.persistFilters.setFiltersToUrl(filters);
  }

  getFeaturedItems() {
    this.fetchFeaturedItems$.next(null);
  }

  clearFilters(): void {
    this.persistFilters.setFiltersToUrl({});
  }

  changePage(page: number, size: number): void {
    this.search({ page: page, size: size });
  }

  private startLoading() {
    this.state.update((state) => ({
      ...state,
      loading: true
    }));
  }

  private stopLoading() {
    this.state.update((state) => ({
      ...state,
      loading: false
    }));
  }

  private setSearchResults(response: PagedResponse<MarketplaceItemDto> | null) {
    this.state.update((state) => ({
      ...state,
      items: response,
      loading: false
    }));
  }

  private setFeaturedItems(response: PagedResponse<MarketplaceItemDto> | null) {
    this.state.update((state) => ({
      ...state,
      featuredItems: response
    }));
  }

  private setError(err: HttpErrorResponse) {
    this.state.update((state) => ({
      ...state,
      error: {
        message: this.getErrorMessage(err),
        status: err.status
      },
      loading: false
    }));
    return EMPTY;
  }

  // async

  private searchItemsOnChangingQueryParams() {
    const featured = this.api.getFeatured().pipe(catchError(() => of(null)));
    this.route.queryParamMap
      .pipe(
        tap(() => this.startLoading()),
        switchMap(() =>
          forkJoin([this.api.search(this.getFilters()), featured])
        ),
        takeUntilDestroyed(),
        catchError((err) => this.setError(err))
      )
      .subscribe((response) => {
        const [items, featuredItems] = response;
        this.setSearchResults(items);
        this.setFeaturedItems(featuredItems);
      });
  }

  // helpers

  getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl(this.filters);
  }

  getQueryFilter() {
    return (this.getFilters()['query'] || '') as string;
  }

  getOfferCategoryFilter() {
    return (this.getFilters()['offerCat'] as string[]) || [];
  }

  getBestPractiseCategoryFilter() {
    return (this.getFilters()['bestPractiseCat'] || []) as string[];
  }

  getThematicFocusFilter() {
    return (this.getFilters()['thematicFocus'] || []) as string[];
  }

  countFilters(): number {
    const thematicFocusFilters = this.getThematicFocusFilter();
    const offerCatValues = this.getOfferCategoryFilter();
    const bestPracticeValues = this.getBestPractiseCategoryFilter();

    const focus = thematicFocusFilters ? thematicFocusFilters.length : 0;
    const offers = offerCatValues ? offerCatValues.length : 0;
    const bestPracts = bestPracticeValues ? bestPracticeValues.length : 0;
    const query = this.getQueryFilter() ? 1 : 0;

    return focus + offers + bestPracts + query;
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    console.log(err);
    return '';
  }
}
