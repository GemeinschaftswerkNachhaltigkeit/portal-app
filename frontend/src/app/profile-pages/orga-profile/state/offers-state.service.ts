import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';

@Injectable({
  providedIn: 'root'
})
export class OffersStateService {
  offersPaged = new BehaviorSubject<PagedResponse<OfferDto>>({
    content: []
  });

  get offers$(): Observable<OfferDto[]> {
    return this.offersPaged
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get offersPaging$(): Observable<Paging> {
    return this.offersPaged.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  setOffersResponse(resp: PagedResponse<OfferDto>): void {
    this.offersPaged.next(resp);
  }
}
