import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import ActiveCard from '../models/active-card';
import { DynamicFilters } from '../models/search-filter';

@Injectable({ providedIn: 'root' })
export abstract class SharedUiStateService {
  private showFullMap = new BehaviorSubject<boolean>(false);
  private mapInitialised = new BehaviorSubject<boolean>(false);
  private filters = new BehaviorSubject<DynamicFilters>({
    viewType: 'ALL'
  });
  private activeCard = new BehaviorSubject<ActiveCard | undefined>(undefined);

  get activeCardId(): number | undefined {
    return this.activeCard.value?.id;
  }

  get activeCardValue(): ActiveCard | undefined {
    return this.activeCard.value;
  }

  get filterValues(): DynamicFilters {
    return this.filters.value;
  }

  get showFullMap$(): Observable<boolean> {
    return this.showFullMap.asObservable();
  }

  get mapInitialised$(): Observable<boolean> {
    return this.mapInitialised.asObservable();
  }

  get filters$(): Observable<DynamicFilters> {
    return this.filters.asObservable();
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    this.activeCard.next(activeCard);
    const filters = this.filterValues;

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

  setFilters(filters: DynamicFilters): void {
    this.filters.next(filters);
  }

  setEnvelope(box: string): void {
    const filters = this.filterValues;
    const updatedFilters = { ...filters, envelope: box };
    this.filters.next(updatedFilters);
  }

  setMapInitialised(): void {
    this.mapInitialised.next(true);
  }

  toggleMap(): void {
    const current = this.showFullMap.value;
    this.showFullMap.next(!current);
  }
}

@Injectable({ providedIn: 'root' })
export class InternalUiStateService {
  private hoveredCard = new BehaviorSubject<ActiveCard | undefined>(undefined);
  private sharedUiState = inject(SharedUiStateService);

  /* #### Common methods valid for internal and embedded map #### */
  get activeCardId(): number | undefined {
    return this.sharedUiState.activeCardId;
  }

  get activeCardValue(): ActiveCard | undefined {
    return this.sharedUiState.activeCardValue;
  }

  get filterValues(): DynamicFilters {
    return this.sharedUiState.filterValues;
  }

  get showFullMap$(): Observable<boolean> {
    return this.sharedUiState.showFullMap$;
  }

  get mapInitialised$(): Observable<boolean> {
    return this.sharedUiState.mapInitialised$;
  }

  get filters$(): Observable<DynamicFilters> {
    return this.sharedUiState.filters$;
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    return this.sharedUiState.setActiveCard(activeCard);
  }

  setFilters(filters: DynamicFilters): void {
    this.sharedUiState.setFilters(filters);
  }

  setEnvelope(box: string): void {
    this.sharedUiState.setEnvelope(box);
  }

  setMapInitialised(): void {
    this.sharedUiState.setMapInitialised();
  }

  toggleMap(): void {
    this.sharedUiState.toggleMap();
  }

  /* #### Methods valid for internal map ui state  #### */
  get hoveredCardValue(): ActiveCard | undefined {
    return this.hoveredCard.value;
  }

  setHoveredCard(hoveredCard?: { type: string; id?: number }): void {
    this.hoveredCard.next(hoveredCard);
  }
}

@Injectable({ providedIn: 'root' })
export class EmbeddedUiStateService {
  private sharedUiState = inject(SharedUiStateService);

  /* #### Common methods valid for internal and embedded map #### */
  get activeCardId(): number | undefined {
    return this.sharedUiState.activeCardId;
  }

  get activeCardValue(): ActiveCard | undefined {
    return this.sharedUiState.activeCardValue;
  }

  get filterValues(): DynamicFilters {
    return this.sharedUiState.filterValues;
  }

  get showFullMap$(): Observable<boolean> {
    return this.sharedUiState.showFullMap$;
  }

  setActiveCard(activeCard?: { type: string; id?: number }): void {
    return this.sharedUiState.setActiveCard(activeCard);
  }

  setFilters(filters: DynamicFilters): void {
    this.sharedUiState.setFilters(filters);
  }

  setEnvelope(box: string): void {
    this.sharedUiState.setEnvelope(box);
  }

  setMapInitialised(): void {
    this.sharedUiState.setMapInitialised();
  }
}
