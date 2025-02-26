import { computed, Injectable, signal } from '@angular/core';
import ActiveCard from '../models/active-card';
import { DynamicFilters } from '../models/search-filter';

interface MapUiState {
  showFullMap: boolean;
  mapInitialised: boolean;
  filters: DynamicFilters;
  activeCard: ActiveCard | undefined;
  hoveredCard: ActiveCard | undefined;
}

@Injectable({ providedIn: 'root' })
export abstract class MapUiService {
  // state

  private state = signal<MapUiState>({
    showFullMap: false,
    mapInitialised: false,
    filters: {
      viewType: 'ALL'
    },
    activeCard: undefined,
    hoveredCard: undefined
  });

  // selectors
  readonly activeCardId = computed(() => this.state().activeCard?.id);
  readonly activeCardValue = computed(() => this.state().activeCard);
  readonly filters = computed(() => this.state().filters);
  readonly showFullMap = computed(() => this.state().showFullMap);
  readonly mapInitialised = computed(() => this.state().mapInitialised);
  readonly hoveredCard = computed(() => this.state().hoveredCard);

  // actions

  setFilters(filters: DynamicFilters) {
    this.state.update((state) => ({
      ...state,
      filters: filters
    }));
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    this.state.update((state) => ({
      ...state,
      activeCard: activeCard
    }));

    const filters = this.filters();

    if (activeCard?.id && activeCard?.type) {
      const updatedFilters = {
        ...filters,
        id: activeCard.id,
        type: activeCard.type
      };
      this.setFilters(updatedFilters);
    } else {
      const updatedFilters = { ...filters };
      delete updatedFilters['id'];
      delete updatedFilters['type'];
      this.setFilters(updatedFilters);
    }
  }

  setEnvelope(box: string): void {
    const filters = this.filters();
    const updatedFilters = { ...filters, envelope: box };
    this.setFilters(updatedFilters);
  }

  setMapInitialised(): void {
    this.state.update((state) => ({
      ...state,
      mapInitialised: true
    }));
  }

  toggleMap(): void {
    this.state.update((state) => ({
      ...state,
      showFullMap: !state.showFullMap
    }));
  }

  setHoveredCard(hoveredCard?: { type: string; id?: number }): void {
    this.state.update((state) => ({
      ...state,
      hoveredCard: hoveredCard
    }));
  }
}
