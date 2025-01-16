import { computed, inject, Injectable, signal } from '@angular/core';
import PagedResponse from '../../shared/models/paged-response';
import MarkerDto from '../models/markerDto';
import SearchResult from '../models/search-result';
import { MapApiService } from './map-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FeaturesService } from 'src/app/shared/components/feature/features.service';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { MapUiService } from './map-ui.service';
import {
  catchError,
  combineLatest,
  concat,
  EMPTY,
  from,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { DynamicFilters } from '../models/search-filter';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import { TranslateService } from '@ngx-translate/core';

type LoadingStates = 'details' | 'search';

type FetchEntryParams = {
  type: string;
  id: number;
};

interface MapState {
  results: PagedResponse<SearchResult> | null;
  markers: MarkerDto[];
  currentResult: SearchResult | null;
  embedded: boolean;
  loaders: Set<LoadingStates>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class MapService {
  private api = inject(MapApiService);
  private uiState = inject(MapUiService);
  private persistFilters = inject(PersistFiltersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private features = inject(FeaturesService);
  private feedback = inject(FeedbackService);
  private translate = inject(TranslateService);

  // state

  private state = signal<MapState>({
    results: null,
    markers: [],
    currentResult: null,
    embedded: false,
    loaders: new Set()
  });

  readonly filterOptions = [
    'thematicFocus',
    'sdgs',
    'impactAreas',
    'orgaTypes',
    'activityTypes',
    'startDate',
    'endDate',
    'viewType'
  ];

  // signals

  private fetchEntry$ = new Subject<FetchEntryParams>();
  private searchEntries$ = new Subject<DynamicFilters>();

  // selectors

  readonly markers = computed(() => this.state().markers);
  readonly currentResult = computed(() => this.state().currentResult);
  readonly embedded = computed(() => this.state().embedded);

  readonly searchResults = computed(() =>
    this.state().results ? this.state().results?.content : null
  );
  readonly searchResultsPaging = computed(() =>
    this.state().results
      ? {
          number: this.state().results?.number,
          size: this.state().results?.size,
          totalElements: this.state().results?.totalElements,
          totalPages: this.state().results?.totalPages
        }
      : null
  );
  readonly mapInitialised = computed(() => this.uiState.mapInitialised());
  readonly hoverActive = computed(() => !!this.uiState.hoveredCard());
  readonly filters = computed(() => this.uiState.filters());
  readonly showFullMap = computed(() => this.uiState.showFullMap());
  readonly loading = computed(() => {
    return this.state().loaders.size > 0;
  });

  hasLoader(loader: LoadingStates) {
    return this.state().loaders.has(loader);
  }

  getResultForIdAndType(type = '', id = -1): SearchResult | undefined {
    return this.searchResults()?.find(
      (sr) => sr.id === id && sr.resultType === type
    );
  }

  getActiveResult(): SearchResult | undefined {
    const card = this.uiState.activeCardValue();
    return this.getResultForIdAndType(card?.type, card?.id);
  }

  hasActiveCard(): boolean {
    return !!this.uiState.activeCardId();
  }

  isActiveCard(type: string, id: number | undefined): boolean {
    return (
      this.uiState.activeCardValue()?.id === id &&
      this.uiState.activeCardValue()?.type.toUpperCase() === type.toUpperCase()
    );
  }

  isHoveredCard(type: string, id: number | undefined): boolean {
    return (
      this.uiState.hoveredCard()?.id === id &&
      this.uiState.hoveredCard()?.type === type
    );
  }

  constructor() {
    this.fetchEntry();
    this.searchEntries();
  }

  // actions

  private startLoading(type: LoadingStates) {
    this.state.update((state) => {
      const loaders = state.loaders.add(type);
      return {
        ...state,
        loading: new Set(loaders)
      };
    });
  }

  private stopLoading(type: LoadingStates) {
    this.state.update((state) => {
      const loaders = new Set(state.loaders);
      loaders.delete(type);
      return {
        ...state,
        loaders: new Set(loaders)
      };
    });
  }

  setEmbedded(embedded: boolean) {
    this.state.update((state) => ({
      ...state,
      embedded: embedded
    }));
  }

  setCurrentResult(res: SearchResult | null): void {
    this.state.update((state) => ({
      ...state,
      currentResult: res
    }));
  }

  setMarkers(markers: MarkerDto[]): void {
    this.state.update((state) => ({
      ...state,
      markers: markers
    }));
  }

  setSearchResponse(resp: PagedResponse<SearchResult>): void {
    this.state.update((state) => ({
      ...state,
      results: resp
    }));
  }

  setInitalFilters(): void {
    const filters = this.persistFilters.getFiltersFromUrl(this.filterOptions);
    this.uiState.setFilters(filters);
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    if (!this.isActiveCard(activeCard?.type || '', activeCard?.id)) {
      this.setCurrentResult(null);
      const filters = this.uiState.filters();

      if (activeCard?.id && activeCard?.type) {
        this.router.navigate(['/', this.embedded() ? 'embeddedmap' : 'map'], {
          queryParams: {
            ...filters,
            type: activeCard?.type,
            id: activeCard?.id
          },
          replaceUrl: true,
          relativeTo: this.route
        });
      }
      this.uiState.setActiveCard(activeCard);
    }
  }

  openCard(type: string, id?: string | number): void {
    if (id) {
      this.setActiveCard({
        type: type,
        id: +id
      });
    }
  }

  closeCard(): void {
    const filters = this.uiState.filters();
    const updatedFilters = { ...filters };
    delete updatedFilters['id'];
    delete updatedFilters['type'];
    this.setActiveCard();
    this.router.navigate(['/', this.embedded() ? 'embeddedmap' : 'map'], {
      queryParams: {
        ...updatedFilters
      },
      replaceUrl: true,
      relativeTo: this.route
    });
  }

  setBoundingBox(box: string): void {
    this.uiState.setEnvelope(box);
    this.composeFilter(this.filters());
  }

  getEntryByIdAndType(type: string, id: number) {
    this.fetchEntry$.next({ type, id });
  }

  search(filters?: DynamicFilters) {
    const finalFilters = this.composeFilter(filters);
    this.searchEntries$.next(finalFilters || {});
  }

  changePage(page: number, size: number) {
    this.setActiveCard();
    const filters = this.uiState.filters();
    this.search({ ...filters, page, size });
  }

  setHoveredCard(hoveredCard?: { type: string; id?: number }): void {
    this.uiState.setHoveredCard(hoveredCard);
  }

  toggleMap(): void {
    this.uiState.toggleMap();
  }

  clearHoveredCard(): void {
    this.uiState.setHoveredCard(undefined);
  }

  // async

  fetchEntry() {
    this.fetchEntry$
      .pipe(
        tap(() => this.startLoading('details')),
        switchMap(({ type, id }) =>
          concat(from(this.features.ready), this.api.byId(type, id))
        ),
        takeUntilDestroyed(),
        catchError(() => {
          this.closeCard();
          this.stopLoading('details');
          this.feedback.showFeedback(
            this.translate.instant('error.unknown'),
            'error'
          );
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (res) {
          this.stopLoading('details');
          this.setCurrentResult(res);
        }
      });
  }

  searchEntries() {
    this.searchEntries$
      .pipe(
        tap(() => this.startLoading('search')),
        switchMap((filters) =>
          concat(
            from(this.features.ready),
            combineLatest([
              this.api.searchMarkers(filters),
              this.api.search(filters)
            ])
          )
        ),
        takeUntilDestroyed(),
        catchError(() => {
          this.stopLoading('search');
          this.feedback.showFeedback(
            this.translate.instant('error.unknown'),
            'error'
          );
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (res) {
          const [markers, results] = res;
          this.stopLoading('search');
          this.setMarkers(markers);
          this.setSearchResponse(results);
        }
      });
  }

  // helpers

  composeFilter(searchFilter?: DynamicFilters): DynamicFilters {
    const existingFilters: DynamicFilters = {
      ...this.uiState.filters()
    };
    let filters;

    if (searchFilter) {
      if (!searchFilter['initiator']) {
        delete searchFilter['initiator'];
      }
      if (!searchFilter['projectSustainabilityWinner']) {
        delete searchFilter['projectSustainabilityWinner'];
      }
      if (!searchFilter['startDate']) {
        delete searchFilter['startDate'];
      }
      if (!searchFilter['endDate']) {
        delete searchFilter['endDate'];
      }
      if (!searchFilter['location']) {
        delete searchFilter['location'];
      }
      if (!searchFilter['query']) {
        delete searchFilter['query'];
      }
      filters = {
        ...searchFilter,
        envelope: existingFilters['envelope']
      };
      this.persistFilters.setFiltersToUrl(searchFilter, [
        '/',
        this.embedded() ? 'embeddedmap' : 'map'
      ]);
    } else {
      filters = existingFilters;
    }

    this.uiState.setFilters(filters);
    if (!filters['envelope']) {
      delete filters['envelope'];
    } else {
      this.uiState.setMapInitialised();
    }

    return filters;
  }
}
