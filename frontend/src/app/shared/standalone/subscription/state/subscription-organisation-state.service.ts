import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Organisation from '../../../models/organisation';
import PagedResponse from '../../../models/paged-response';
import Paging from '../../../models/paging';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionOrganisationStateService {
  private organisationSubscriptionsResponse = new BehaviorSubject<
    PagedResponse<{ organisation: Organisation }>
  >({ content: [] });

  get organisationSubscriptions$(): Observable<Organisation[]> {
    return this.organisationSubscriptionsResponse
      .asObservable()
      .pipe(map((response) => response.content.map((c) => c.organisation)));
  }

  get organisationSubscriptionsPaging$(): Observable<Paging> {
    return this.organisationSubscriptionsResponse.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  oganisationIsSubcribed(id?: number): boolean {
    const resp = this.organisationSubscriptionsResponse.value;
    if (resp) {
      const ids = resp.content.map((c) => c.organisation.id || -1);
      return this.isSubscibed(ids, id);
    } else {
      return false;
    }
  }

  setOrganisationSubscriptionsResp(
    resp: PagedResponse<{ organisation: Organisation }>
  ): void {
    this.organisationSubscriptionsResponse.next(resp);
  }

  private isSubscibed(ids: number[], id?: number): boolean {
    return !!id && ids.includes(id);
  }
}
