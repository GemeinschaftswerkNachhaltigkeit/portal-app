import { Injectable, inject } from '@angular/core';
import { MapApiService } from './map/api/map-api.service';
import PagedResponse from '../shared/models/paged-response';
import { DynamicFilters } from './models/search-filter';
import { PersistFiltersService } from '../shared/services/persist-filters.service';
import {EmbeddedMapStateService, InternalMapStateService, SharedMapStateService} from './state/map-state.service';
import {EmbeddedUiStateService, InternalUiStateService, SharedUiStateService} from './state/ui-state.service';
import { Subscription, take } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import SearchResult from './models/search-result';
import { ActivatedRoute, Router } from '@angular/router';
import MarkerDto from './models/markerDto';

// common map facade services
@Injectable({providedIn: 'root'})
export class SharedMapFacade {
  private mapApi = inject(MapApiService);
  private mapState = inject(SharedMapStateService);
  private uiState = inject(SharedUiStateService);
  private persistFilters = inject(PersistFiltersService);
  private loading = inject(LoadingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
  searchRequest?: Subscription;

  openCard(type: string, id?: string | number): void {
    if (id) {
      this.setActiveCard({
        type: type,
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
    this.router.navigate(['/', this.mapState.isEmbedded ? 'embeddedmap' : 'map'], {
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
        this.router.navigate(['/', this.mapState.isEmbedded ? 'embeddedmap' : 'map'], {
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

  composeFilter(searchFilter?: DynamicFilters): DynamicFilters {
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
      this.persistFilters.setFiltersToUrl(searchFilter, ['/', this.mapState.isEmbedded ? 'embeddedmap' : 'map']);
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

  searchMarkers(filters: DynamicFilters): void {
    this.mapApi.searchMarkers(filters).pipe(take(1)).subscribe({
      next: (resp: MarkerDto[]) => {
        this.mapState.setMarkers(resp);
      }
    });
  }

  setBoundingBox(box: string): void {
    this.uiState.setEnvelope(box);
    this.composeFilter();
  }

  setEmbedded(isEmbedded: boolean) {
    this.mapState.isEmbedded = isEmbedded;
  }
}

// MapFacade services for internal map
@Injectable({providedIn: 'root'})
export class InternalMapFacade {
  private internalMapState = inject(InternalMapStateService);
  private internalUiState = inject(InternalUiStateService);
  private mapApi = inject(MapApiService);
  private loading = inject(LoadingService);

  currentResult$ = this.internalMapState.currentResult$;
  markers$ = this.internalMapState.markers$;
  searchResults$ = this.internalMapState.searchResults$; // internal map only
  searchPaging$ = this.internalMapState.searchPaging$; // internal map only
  filters$ = this.internalUiState.filters$; // internal map only
  mapInitialised$ = this.internalUiState.mapInitialised$; // internal map only

  /* #### Common methods valid for internal and embedded map #### */
  sharedMapFacade = inject(SharedMapFacade);
  showFullMap$ = this.internalUiState.showFullMap$;

  openCard(type: string, id?: string | number): void {
    this.sharedMapFacade.openCard(type, id);
  }

  closeCard(): void {
    this.sharedMapFacade.closeCard();
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    this.sharedMapFacade.setActiveCard(activeCard);
  }

  getActiveResult(): SearchResult | undefined {
    return this.sharedMapFacade.getActiveResult();
  }

  hasActiveCard(): boolean {
    return this.sharedMapFacade.hasActiveCard();
  }

  isActiveCard(type: string, id: number | undefined): boolean {
    return this.sharedMapFacade.isActiveCard(type, id);
  }

  setInitalFilters(): void {
    this.sharedMapFacade.setInitalFilters();
  }

  getById(type: string, id: number): void {
    this.sharedMapFacade.getById(type, id);
  }

  search(searchFilter?: DynamicFilters): void {
    const filters = this.sharedMapFacade.composeFilter(searchFilter);
    this.searchCards(filters);
    this.sharedMapFacade.searchMarkers(filters);
  }

  private searchCards(filters: DynamicFilters): void {
    this.mapApi.search(filters).pipe(take(1)).subscribe({
      next: (resp: PagedResponse<SearchResult>) => {
        this.internalMapState.setSearchResponse(resp);
        this.loading.stop('map-search');
      },
      error: () => {
        this.loading.stop('map-search');
      }
    });
  }

  setBoundingBox(box: string): void {
    this.sharedMapFacade.setBoundingBox(box);
    this.search();
  }

  setEmbedded(isEmbedded: boolean) {
    this.sharedMapFacade.setEmbedded(isEmbedded);
  }

  /* #### Methods valid for internal map only #### */
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

}

// MapFacade services for embedded map
@Injectable({providedIn: 'root'})
export class EmbeddedMapFacade {

  /* #### Common methods valid for internal and embedded map #### */
  private sharedMapFacade = inject(SharedMapFacade);
  private embeddedUiState = inject(EmbeddedUiStateService);
  private embeddedMapState = inject(EmbeddedMapStateService);

  showFullMap$ = this.embeddedUiState.showFullMap$;
  currentResult$ = this.embeddedMapState.currentResult$;
  markers$ = this.embeddedMapState.markers$;

  openCard(type: string, id?: string | number): void {
    this.sharedMapFacade.openCard(type, id);
  }

  closeCard(): void {
    this.sharedMapFacade.closeCard();
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    this.sharedMapFacade.setActiveCard(activeCard);
  }

  getActiveResult(): SearchResult | undefined {
    return this.sharedMapFacade.getActiveResult();
  }

  hasActiveCard(): boolean {
    return this.sharedMapFacade.hasActiveCard();
  }

  isActiveCard(type: string, id: number | undefined): boolean {
    return this.sharedMapFacade.isActiveCard(type, id);
  }

  setInitalFilters(): void {
    this.sharedMapFacade.setInitalFilters();
  }

  getById(type: string, id: number): void {
    this.sharedMapFacade.getById(type, id);
  }

  search(searchFilter?: DynamicFilters): void {
    const filters = this.sharedMapFacade.composeFilter(searchFilter);
    this.sharedMapFacade.searchMarkers(filters);
  }

  setBoundingBox(box: string): void {
    this.sharedMapFacade.setBoundingBox(box);
    this.search();
  }

  setEmbedded(isEmbedded: boolean) {
    this.sharedMapFacade.setEmbedded(isEmbedded);
  }

}
