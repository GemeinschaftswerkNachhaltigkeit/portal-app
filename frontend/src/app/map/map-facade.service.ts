import { Injectable, inject } from '@angular/core';
import { MapApiService } from './map/api/map-api.service';
import PagedResponse from '../shared/models/paged-response';
import { DynamicFilters } from './models/search-filter';
import { PersistFiltersService } from '../shared/services/persist-filters.service';
import { InternalMapStateService, SharedMapStateService } from './state/map-state.service';
import {InternalUiStateService, SharedUiStateService} from './state/ui-state.service';
import { Subscription, take } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import SearchResult from './models/search-result';
import { ActivatedRoute, Router } from '@angular/router';
import MarkerDto from './models/markerDto';

// common map facade services
@Injectable({providedIn: 'root'})
export abstract class SharedMapFacade {
  // explanation inheritance with dependency injection see here:
  // https://www.danywalls.com/using-the-inject-function-in-angular-15
  mapApi = inject(MapApiService);
  mapState = inject(SharedMapStateService);
  uiState = inject(SharedUiStateService);
  persistFilters = inject(PersistFiltersService);
  loading = inject(LoadingService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  listQueryParams = [
    'thematicFocus',
    'sdgs',
    'impactAreas',
    'orgaTypes',
    'activityTypes',
    'startDate',
    'endDate',
    'viewType'
  ];

  currentResult$ = this.mapState.currentResult$;
  markers$ = this.mapState.markers$;
  showFullMap$ = this.uiState.showFullMap$;

  searchRequest?: Subscription;

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
    this.router.navigate(['/', this.mapState.isEmbedded ? 'embeddedMap' : 'map'], {
      queryParams: {
        ...updatedFilters
      },
      replaceUrl: true,
      relativeTo: this.route
    });
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    if (!this.isActiveCard(activeCard?.type || '', activeCard?.id)) {
      this.mapState.setCurrentResult(null);
      const filters = this.uiState.filterValues;

      if (activeCard?.id && activeCard?.type) {
        this.router.navigate(['/', this.mapState.isEmbedded ? 'embeddedMap' : 'map'], {
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

  getActiveResult(): SearchResult | undefined {
    const card = this.uiState.activeCardValue;
    return this.mapState.getResultForIdAndType(card?.type, card?.id);
  }

  hasActiveCard(): boolean {
    return !!this.uiState.activeCardId;
  }

  isActiveCard(type: string, id: number | undefined): boolean {
    return (
      this.uiState.activeCardValue?.id === id &&
      this.uiState.activeCardValue?.type.toUpperCase() === type.toUpperCase()
    );
  }

  setInitalFilters(): void {
    const filters = this.persistFilters.getFiltersFromUrl(this.listQueryParams);
    this.uiState.setFilters(filters);
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

  search(searchFilter?: DynamicFilters): void {
    this.loading.start('map-search');
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
      this.persistFilters.setFiltersToUrl(searchFilter, ['/', this.mapState.isEmbedded ? 'embeddedMap' : 'map']);
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

    this.initiateSearch(filters);
  }

  protected initiateSearch(filters: DynamicFilters) {
    this.searchMarkers(filters);
  }

  protected searchMarkers(filters: DynamicFilters): void {
    this.searchRequest = this.mapApi.searchMarkers(filters).subscribe({
      next: (resp: MarkerDto[]) => {
        this.mapState.setMarkers(resp);
      }
    });
  }

  setBoundingBox(box: string): void {
    this.uiState.setEnvelope(box);
    this.search();
  }

  setEmbedded(isEmbedded: boolean) {
    this.mapState.isEmbedded = isEmbedded;
  }
}

// MapFacade services for internal map
@Injectable({providedIn: 'root'})
export class InternalMapFacade extends SharedMapFacade {
  internalMapState = inject(InternalMapStateService);
  internalUiState = inject(InternalUiStateService);

  searchResults$ = this.internalMapState.searchResults$; // internal map only
  searchPaging$ = this.internalMapState.searchPaging$; // internal map only
  filters$ = this.internalUiState.filters$; // internal map only
  mapInitialised$ = this.internalUiState.mapInitialised$; // internal map only

  constructor() {
    super();
  }

  toggleMap(): void {
    this.internalUiState.toggleMap();
  }

  hoverActive(): boolean {
    return !!this.internalUiState.hoveredCardValue;
  }

  setHoveredCard(hoveredCard?: { type: string; id?: number }): void {
    this.internalUiState.setHoveredCard(hoveredCard);
  }

  isHoveredCard(type: string, id: number | undefined): boolean {
    return (
      this.internalUiState.hoveredCardValue?.id === id &&
      this.internalUiState.hoveredCardValue?.type === type
    );
  }

  clearHoveredCard(): void {
    this.internalUiState.setHoveredCard(undefined);
  }

  changePage(page: number, size: number) {
    this.setActiveCard();
    const filters = this.internalUiState.filterValues;
    this.search({ ...filters, page, size });
  }

  protected searchCards(filters: DynamicFilters): void {
    this.searchRequest = this.mapApi.search(filters).subscribe({
      next: (resp: PagedResponse<SearchResult>) => {
        this.internalMapState.setSearchResponse(resp);
        this.loading.stop('map-search');
      },
      error: () => {
        this.loading.stop('map-search');
      }
    });
  }

  override initiateSearch(filters: DynamicFilters) {
    this.searchCards(filters);
    this.searchMarkers(filters);
  }

}

// MapFacade services for embedded map
@Injectable({providedIn: 'root'})
export class EmbeddedMapFacade extends SharedMapFacade {

  constructor() {
    super();
  }

}
