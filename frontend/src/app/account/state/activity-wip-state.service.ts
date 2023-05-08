import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';

@Injectable({
  providedIn: 'root'
})
export class ActivityWipStateService {
  private pagedActivityWipResponse =
    new BehaviorSubject<PagedResponse<ActivityWIP> | null>(null);

  get activitiyWips$(): Observable<ActivityWIP[]> {
    return this.pagedActivityWipResponse
      .asObservable()
      .pipe(map((response) => response?.content || []));
  }

  get activityWipsPaging$(): Observable<Paging> {
    return this.pagedActivityWipResponse.asObservable().pipe(
      map((response) => ({
        number: response?.number,
        size: response?.size,
        totalElements: response?.totalElements,
        totalPages: response?.totalPages
      }))
    );
  }

  setActivityWipsResponse(resp: PagedResponse<ActivityWIP> | null): void {
    this.pagedActivityWipResponse.next(resp);
  }
}
