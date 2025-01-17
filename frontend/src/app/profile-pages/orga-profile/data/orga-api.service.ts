import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BestPracticeApiService } from 'src/app/marketplace/api/best-practices-api.service';
import { OffersApiService } from 'src/app/marketplace/api/offers-api.service';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import PagedResponse from 'src/app/shared/models/paged-response';
import { PageQuerParams } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import Activity from '../../../shared/models/actvitiy';
import Organisation from '../../../shared/models/organisation';

@Injectable({
  providedIn: 'root'
})
export class OrgaApiService {
  constructor(
    private http: HttpClient,
    private offersApi: OffersApiService,
    private bestPracticesApi: BestPracticeApiService
  ) {}

  byId(id: number): Observable<Organisation> {
    return this.http
      .get<Organisation>(`${environment.apiUrl}/organisations/${id}`, {})
      .pipe(
        map((result: Organisation) => {
          return result;
        })
      );
  }

  activites(
    id: number,
    paging: PageQuerParams
  ): Observable<PagedResponse<Activity>> {
    return this.http
      .get<PagedResponse<Activity>>(
        `${environment.apiUrl}/organisations/${id}/activities`,
        {
          params: {
            ...paging,
            includeDan: true
          }
        }
      )
      .pipe(
        map((result: PagedResponse<Activity>) => {
          return result;
        })
      );
  }

  offers(
    orgaId: number,
    paging?: PageQuerParams
  ): Observable<PagedResponse<OfferDto>> {
    return this.offersApi.getPagedOffers(orgaId, paging);
  }

  bestPractices(
    orgaId: number,
    paging?: PageQuerParams
  ): Observable<PagedResponse<BestPracticesDto>> {
    return this.bestPracticesApi.getPagedBestPractices(orgaId, paging);
  }
}
