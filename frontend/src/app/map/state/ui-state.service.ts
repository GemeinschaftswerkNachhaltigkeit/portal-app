import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import ActiveCard from '../models/active-card';
import { DynamicFilters } from '../models/search-filter';

@Injectable({ providedIn: 'root' })
export abstract class SharedUiStateService {
  protected showFullMap = new BehaviorSubject<boolean>(false);
  protected mapInitialised = new BehaviorSubject<boolean>(false);
  protected filters = new BehaviorSubject<DynamicFilters>({
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
}

@Injectable({ providedIn: 'root' })
export class InternalUiStateService extends SharedUiStateService {
  private hoveredCard = new BehaviorSubject<ActiveCard | undefined>(undefined);

  get hoveredCardValue(): ActiveCard | undefined {
    return this.hoveredCard.value;
  }

  get filters$(): Observable<DynamicFilters> {
    return this.filters.asObservable();
  }

  get mapInitialised$(): Observable<boolean> {
    return this.mapInitialised.asObservable();
  }

  setHoveredCard(hoveredCard?: { type: string; id?: number }): void {
    this.hoveredCard.next(hoveredCard);
  }

  toggleMap(): void {
    const current = this.showFullMap.value;
    this.showFullMap.next(!current);
  }
}
