import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';
import Activity from '../../../shared/models/actvitiy';

@Injectable({
  providedIn: 'root'
})
export class ActivityStateService {
  activitiesPaged = new BehaviorSubject<PagedResponse<Activity>>({
    content: []
  });

  get activities$(): Observable<Activity[]> {
    return this.activitiesPaged
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get activitiesPaging$(): Observable<Paging> {
    return this.activitiesPaged.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  setActivitiesResponse(resp: PagedResponse<Activity>): void {
    this.activitiesPaged.next(resp);
  }
}
