import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicFilters } from 'src/app/map/models/search-filter';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { SearchApiService } from './search-api.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

export type Type = 'orga' | 'event' | 'marketplace';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly MAIN_RESULTS = 1;

  api = inject(SearchApiService);
  route = inject(ActivatedRoute);
  persistFilters = inject(PersistFiltersService);
  loading = inject(LoadingService);

  filters = signal<DynamicFilters>({});
  error = signal<boolean>(false);
  loading1 = signal<boolean>(false);

  results$ = toObservable(this.filters).pipe(
    switchMap((filters) => {
      this.loading.start('search-loader');
      switch (filters['type']) {
        case 'orga':
          return this.api.searchOrgas(filters);
        case 'event':
          return this.api.searchEvents(filters);
        case 'marketplace':
          return this.api.searchMarketplace(filters);
        default:
          return this.api.searchOrgas(filters);
      }
    }),
    tap(() => {
      this.loading.stop('search-loader');
    })
  );

  pagedResults = toSignal(this.results$, { initialValue: null });
  results = computed(() => {
    return this.pagedResults()?.content || [];
  });
  mainResults = computed(() => this.results().slice(0, this.MAIN_RESULTS));
  remainingResults = computed(() => this.results().slice(this.MAIN_RESULTS));
  searchValue = computed(() => (this.filters()['query'] as string) || '');
  activeType = computed(() => (this.filters()['type'] as Type) || '');

  constructor() {
    this.triggerSearchOnQueryParamsChange();
  }

  search(searchValue: string): void {
    const filters = this.getFilters();
    this.persistFilters.setFiltersToUrl({ ...filters, query: searchValue });
  }

  setResultType(type: Type): void {
    const filters = this.getFilters();
    this.persistFilters.setFiltersToUrl({
      ...filters,
      type: type || 'orga'
    });
  }

  private getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl();
  }

  private triggerSearchOnQueryParamsChange(): void {
    this.route.queryParamMap.subscribe(() => {
      const filters = this.getFilters();
      this.filters.set({
        ...filters,
        type: filters['type'] || 'orga'
      });
    });
  }
}
