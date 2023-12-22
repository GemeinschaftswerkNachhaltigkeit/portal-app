import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicFilters } from 'src/app/map/models/search-filter';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchApiService } from './search-api.service';

export type Type = 'orga' | 'event' | 'marketplace';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  api = inject(SearchApiService);
  route = inject(ActivatedRoute);
  persistFilters = inject(PersistFiltersService);

  filters = signal<DynamicFilters>({});

  results$ = toObservable(this.filters).pipe(
    switchMap((filters) => {
      switch (filters['type']) {
        case 'orga':
          return this.api.searchOrgas(filters);
        case 'event':
          return this.api.searchEvents(filters);
        case 'marketplace':
          return this.api.searchMarketplace(filters);
        default:
          return EMPTY;
      }
    })
  );

  pagedResults = toSignal(this.results$, { initialValue: null });
  results = computed(() => this.pagedResults()?.content || []);
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
      type: type
    });
  }

  private getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl();
  }

  private triggerSearchOnQueryParamsChange(): void {
    this.route.queryParamMap.subscribe(() => {
      const filters = this.getFilters();
      this.filters.set(filters);
    });
  }
}
