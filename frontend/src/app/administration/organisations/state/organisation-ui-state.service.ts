import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicFilters } from 'src/app/map/map/models/search-filter';

@Injectable({
  providedIn: 'root'
})
export class OrganisationUiStateService {
  private filters = new BehaviorSubject<DynamicFilters>({
    viewType: 'ALL'
  });

  get filterValues(): DynamicFilters {
    return this.filters.value;
  }

  get filters$(): Observable<DynamicFilters> {
    return this.filters.asObservable();
  }

  setFilters(filters: DynamicFilters): void {
    this.filters.next(filters);
  }
}
