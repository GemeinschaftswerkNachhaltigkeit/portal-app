import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import { PageQuerParams } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import { OfferDto } from '../models/offer-dto';
import { OfferWipDto } from '../models/offer-wip-dto';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class OffersApiService {
  constructor(private http: HttpClient) {}

  setStatus(
    orgId: number,
    offerId: number,
    status: Status
  ): Observable<object> {
    return this.http.put(
      `${environment.apiUrl}/organisations/${orgId}/marketplace/offer/${offerId}/status`,
      { status: status }
    );
  }

  createOffer(orgId: number): Observable<string> {
    return this.http
      .post<OfferWipDto>(
        `${environment.apiUrl}/organisations/${orgId}/marketplace/offer`,
        {}
      )
      .pipe(
        map((offer) => {
          return offer.randomUniqueId || '';
        })
      );
  }

  updateOffer(orgId: number, offerId: number): Observable<string> {
    return this.http
      .put<OfferWipDto>(
        `${environment.apiUrl}/organisations/${orgId}/marketplace/offer/${offerId}`,
        {}
      )
      .pipe(
        map((offer) => {
          return offer.randomUniqueId || '';
        })
      );
  }

  deleteOffer(orgId: number, offerId: number): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/marketplace/offer/${offerId}`
    );
  }

  deleteOfferWip(orgId: number, uuid: string): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/offer/${uuid}`
    );
  }

  getOffersWip(orgId: number, uuid: string): Observable<OfferWipDto> {
    return this.http.get<OfferWipDto>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/offer/${uuid}`
    );
  }

  saveOffersWip(
    orgId: number,
    uuid: string,
    offersWip: OfferWipDto
  ): Observable<OfferWipDto> {
    return this.http.put<OfferWipDto>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/offer/${uuid}`,
      offersWip
    );
  }
  releaseOffersWip(
    orgId: number,
    uuid: string,
    offersWip: OfferWipDto
  ): Observable<OfferWipDto> {
    return this.http.post<OfferWipDto>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/offer/${uuid}/releases`,
      offersWip
    );
  }

  deleteOfferImage(orgId: number, uuid: string): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/offer/${uuid}/image`
    );
  }

  getPagedOfferWips(
    orgId: number,
    paging?: PageQuerParams
  ): Observable<PagedResponse<OfferWipDto>> {
    return this.http.get<PagedResponse<OfferWipDto>>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/offer`,
      {
        params: paging
      }
    );
  }

  getPagedOffers(
    orgId: number,
    paging?: PageQuerParams
  ): Observable<PagedResponse<OfferDto>> {
    return this.http.get<PagedResponse<OfferDto>>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace/offer`,
      {
        params: paging
      }
    );
  }
}
