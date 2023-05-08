import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import PagedResponse from '../../../models/paged-response';
import Paging from '../../../models/paging';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionOfferStateService {
  private offerSubscriptionsResponse = new BehaviorSubject<
    PagedResponse<{ offer: OfferDto }>
  >({ content: [] });

  get offerSubscriptions$(): Observable<OfferDto[]> {
    return this.offerSubscriptionsResponse
      .asObservable()
      .pipe(map((response) => response.content.map((c) => c.offer)));
  }

  get offerSubscriptionsPaging$(): Observable<Paging> {
    return this.offerSubscriptionsResponse.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  offerIsSubcribed(id?: number): boolean {
    const resp = this.offerSubscriptionsResponse.value;
    if (resp) {
      const ids = resp.content.map((c) => c.offer.id || -1);
      return this.isSubscibed(ids, id);
    } else {
      return false;
    }
  }

  setOfferSubscriptionsResp(resp: PagedResponse<{ offer: OfferDto }>): void {
    this.offerSubscriptionsResponse.next(resp);
  }

  private isSubscibed(ids: number[], id?: number): boolean {
    return !!id && ids.includes(id);
  }
}
