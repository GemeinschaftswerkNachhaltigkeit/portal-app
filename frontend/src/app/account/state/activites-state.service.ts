import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Activity from 'src/app/shared/models/actvitiy';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';

@Injectable({
  providedIn: 'root'
})
export class ActivitesStateService {
  private pagedActivitiesResponse =
    new BehaviorSubject<PagedResponse<Activity> | null>(null);

  get activities$(): Observable<Activity[]> {
    return this.pagedActivitiesResponse
      .asObservable()
      .pipe(map((response) => response?.content || []));
  }

  get activitiesPaging$(): Observable<Paging> {
    return this.pagedActivitiesResponse.asObservable().pipe(
      map((response) => ({
        number: response?.number,
        size: response?.size,
        totalElements: response?.totalElements,
        totalPages: response?.totalPages
      }))
    );
  }

  setActivitiesResponse(resp: PagedResponse<Activity> | null): void {
    this.pagedActivitiesResponse.next(resp);
  }
}
