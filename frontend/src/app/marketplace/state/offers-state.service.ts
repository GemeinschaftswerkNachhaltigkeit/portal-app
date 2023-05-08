import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';
import { OfferDto } from '../models/offer-dto';
import { OfferWipDto } from '../models/offer-wip-dto';

@Injectable({
  providedIn: 'root'
})
export class OffersStateService {
  private offersWip = new BehaviorSubject<OfferWipDto | null>(null);
  private offersWipUuid = new BehaviorSubject<string | null>(null);
  private offerWips = new BehaviorSubject<PagedResponse<OfferWipDto>>({
    content: []
  });
  private offers = new BehaviorSubject<PagedResponse<OfferDto>>({
    content: []
  });

  get offers$(): Observable<OfferDto[]> {
    return this.offers.asObservable().pipe(
      map((pagedOffers: PagedResponse<OfferDto>) => {
        return pagedOffers.content;
      })
    );
  }

  get offersPaging$(): Observable<Paging> {
    return this.offers.asObservable().pipe(
      map((response: PagedResponse<OfferWipDto>) => {
        return {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        };
      })
    );
  }

  get offerWips$(): Observable<OfferWipDto[]> {
    return this.offerWips.asObservable().pipe(
      map((pagedOffers: PagedResponse<OfferWipDto>) => {
        return pagedOffers.content;
      })
    );
  }

  get offerWipsPaging$(): Observable<Paging> {
    return this.offerWips.asObservable().pipe(
      map((response: PagedResponse<OfferDto>) => {
        return {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        };
      })
    );
  }

  get offersWip$(): Observable<OfferWipDto | null> {
    return this.offersWip.asObservable();
  }

  get offersWipUuid$(): Observable<string | null> {
    return this.offersWipUuid.asObservable();
  }

  setOfferWip(offersWip: OfferWipDto): void {
    this.offersWip.next(offersWip);
  }
  setOffersWipUuid(offersWipUuid: string): void {
    this.offersWipUuid.next(offersWipUuid);
  }

  setOffersResponse(resp: PagedResponse<OfferDto>): void {
    this.offers.next(resp);
  }

  setOfferWipsResponse(resp: PagedResponse<OfferWipDto>): void {
    this.offerWips.next(resp);
  }
}
