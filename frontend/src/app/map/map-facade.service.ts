import { Injectable } from '@angular/core';
import { MapApiService } from './map/api/map-api.service';
import PagedResponse from '../shared/models/paged-response';
import { DynamicFilters } from './map/models/search-filter';
import { PersistFiltersService } from '../shared/services/persist-filters.service';
import { MapStateService } from './map/state/map-state.service';
import { UiStateService } from './map/state/ui-state.service';
import { Subscription, take } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import SearchResult from './map/models/search-result';
import { ActivatedRoute, Router } from '@angular/router';
import MarkerDto from './map/models/markerDto';

@Injectable({
  providedIn: 'root'
})
export class MapFacadeService {
  constructor(
    private mapApi: MapApiService,
    private mapState: MapStateService,
    private uiState: UiStateService,
    private persistFilters: PersistFiltersService,
    private loading: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  listQueryParams = [
    'thematicFocus',
    'sdgs',
    'impactAreas',
    'orgaTypes',
    'activityTypes',
    'startDate',
    'endDate'
  ];

  searchResults$ = this.mapState.searchResults$;
  searchPaging$ = this.mapState.searchPaging$;
  currentResult$ = this.mapState.currentResult$;
  markers$ = this.mapState.markers$;
  showFullMap$ = this.uiState.showFullMap$;
  filters$ = this.uiState.filters$;
  mapInitialised$ = this.uiState.mapInitialised$;

  searchRequest?: Subscription;

  toggleMap(): void {
    this.uiState.toggleMap();
  }

  isActiveCard(type: string, id: number | undefined): boolean {
    return (
      this.uiState.activeCardValue?.id === id &&
      this.uiState.activeCardValue?.type.toUpperCase() === type.toUpperCase()
    );
  }

  getActiveResult(): SearchResult | undefined {
    const card = this.uiState.activeCardValue;
    return this.mapState.getResultForIdAndType(card?.type, card?.id);
  }

  hoverActive(): boolean {
    return !!this.uiState.hoveredCardValue;
  }

  isHoveredCard(type: string, id: number | undefined): boolean {
    return (
      this.uiState.hoveredCardValue?.id === id &&
      this.uiState.hoveredCardValue?.type === type
    );
  }

  hasActiveCard(): boolean {
    return !!this.uiState.activeCardId;
  }

  setHoveredCard(hoveredCard?: { type: string; id?: number }): void {
    this.uiState.setHoveredCard(hoveredCard);
  }

  clearHoveredCard(): void {
    this.uiState.setHoveredCard(undefined);
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    if (!this.isActiveCard(activeCard?.type || '', activeCard?.id)) {
      this.mapState.setCurrentResult(null);
      const filters = this.uiState.filterValues;

      if (activeCard?.id && activeCard?.type) {
        this.router.navigate(['/', 'map'], {
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
        type: type === 'DAN' ? 'ACTIVITY' : type,
        id: +id
      });
    }
  }

  closeCard(): void {
    const filters = this.uiState.filterValues;
    const updatedFilters = { ...filters };
    delete updatedFilters['id'];
    delete updatedFilters['type'];
    this.setActiveCard();
    this.router.navigate(['/', 'map'], {
      queryParams: {
        ...updatedFilters
      },
      replaceUrl: true,
      relativeTo: this.route
    });
  }

  setInitalFilters(): void {
    const filters = this.persistFilters.getFiltersFromUrl(this.listQueryParams);
    this.uiState.setFilters(filters);
  }

  changePage(page: number, size: number) {
    this.setActiveCard();
    const filters = this.uiState.filterValues;
    this.searchCards({ ...filters, page, size });
    this.searchMarkers({ ...filters, page, size });
  }

  getById(type: string, id: number): void {
    const loadingId = this.loading.start('detail-popup-data');
    this.mapApi
      .byId(type, id)
      .pipe(take(1))
      .subscribe({
        next: (res: SearchResult) => {
          this.loading.stop(loadingId);
          this.mapState.setCurrentResult(res);
        },
        error: () => {
          this.loading.stop(loadingId);
        }
      });
  }

  setBoundingBox(box: string): void {
    this.uiState.setEnvelope(box);
    this.searchCards();
    this.searchMarkers();
  }

  private filters(searchFilter?: DynamicFilters): DynamicFilters {
    const existingFilters = this.uiState.filterValues;
    let filters;
    if (searchFilter) {
      if (!searchFilter['initiator']) {
        delete searchFilter['initiator'];
      }
      if (!searchFilter['projectSustainabilityWinner']) {
        delete searchFilter['projectSustainabilityWinner'];
      }
      filters = {
        ...searchFilter,
        envelope: existingFilters['envelope']
      };
      this.persistFilters.setFiltersToUrl(searchFilter, ['/', 'map']);
    } else {
      filters = existingFilters;
    }

    this.uiState.setFilters(filters);
    if (this.searchRequest) {
      this.searchRequest.unsubscribe();
    }
    if (!filters['envelope']) {
      delete filters['envelope'];
    } else {
      this.uiState.setMapInitialised();
    }
    return filters;
  }

  // Cards and Markers may be searched independently. Comes in with external Map requirement.
  searchCards(searchFilter?: DynamicFilters): void {
    this.loading.start('map-search');
    const filters = this.filters(searchFilter);
    this.searchRequest = this.mapApi.search(filters).subscribe({
      next: (resp: PagedResponse<SearchResult>) => {
        this.mapState.setSearchResponse(resp);
        this.loading.stop('map-search');
      },
      error: () => {
        this.loading.stop('map-search');
      }
    });
  }

  searchMarkers(searchFilter?: DynamicFilters): void {
    const filters = this.filters(searchFilter);
    this.searchRequest = this.mapApi.searchMarkers(filters).subscribe({
      next: (resp: MarkerDto[]) => {
        this.mapState.setMarkers(resp);
      }
    });
  }
}
