import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Activity from '../../../models/actvitiy';
import PagedResponse from '../../../models/paged-response';
import Paging from '../../../models/paging';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionActivityStateService {
  private activitySubscriptionsResponse = new BehaviorSubject<
    PagedResponse<{ activity: Activity }>
  >({ content: [] });

  get activitySubscriptions$(): Observable<Activity[]> {
    return this.activitySubscriptionsResponse
      .asObservable()
      .pipe(map((response) => response.content.map((c) => c.activity)));
  }

  get activitySubscriptionsPaging$(): Observable<Paging> {
    return this.activitySubscriptionsResponse.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  activityIsSubcribed(id?: number): boolean {
    const resp = this.activitySubscriptionsResponse.value;
    if (resp) {
      const ids = resp.content.map((c) => c.activity.id || -1);
      return this.isSubscibed(ids, id);
    } else {
      return false;
    }
  }

  setActivitySubscriptionsResp(
    resp: PagedResponse<{ activity: Activity }>
  ): void {
    this.activitySubscriptionsResponse.next(resp);
  }

  private isSubscibed(ids: number[], id?: number): boolean {
    return !!id && ids.includes(id);
  }
}
