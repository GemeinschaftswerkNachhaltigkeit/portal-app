import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import Organisation from 'src/app/shared/models/organisation';
import { environment } from 'src/environments/environment';
import Activity from '../../../models/actvitiy';
import PagedResponse from '../../../models/paged-response';
import { PageQuerParams } from '../../../models/paging';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionApiService {
  constructor(private http: HttpClient) {}

  fetchOrganisationSubscriptions(
    pageParams: PageQuerParams = {}
  ): Observable<PagedResponse<{ organisation: Organisation }>> {
    return this.http.get<PagedResponse<{ organisation: Organisation }>>(
      `${environment.apiUrl}/organisation-subscription`,
      {
        params: pageParams
      }
    );
  }

  fetchActivitiySubscriptions(
    pageParams: PageQuerParams = {}
  ): Observable<PagedResponse<{ activity: Activity }>> {
    return this.http.get<PagedResponse<{ activity: Activity }>>(
      `${environment.apiUrl}/activity-subscription`,
      {
        params: pageParams
      }
    );
  }

  fetchOfferSubscriptions(
    pageParams: PageQuerParams = {}
  ): Observable<PagedResponse<{ offer: OfferDto }>> {
    return this.http.get<PagedResponse<{ offer: OfferDto }>>(
      `${environment.apiUrl}/offer-subscription`,
      {
        params: pageParams
      }
    );
  }

  fetchBestPracticeSubscriptions(
    pageParams: PageQuerParams = {}
  ): Observable<PagedResponse<{ bestPractice: BestPracticesDto }>> {
    return this.http.get<PagedResponse<{ bestPractice: BestPracticesDto }>>(
      `${environment.apiUrl}/bestPractice-subscription`,
      {
        params: pageParams
      }
    );
  }

  followOrganisation(id: number): Observable<object> {
    return this.http.post(`${environment.apiUrl}/organisation-subscription`, {
      organisationId: id
    });
  }
  unfollowOrganisation(id: number): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/organisation-subscription`, {
      body: {
        organisationId: id
      }
    });
  }
  bookmarkActivity(id: number): Observable<object> {
    return this.http.post(`${environment.apiUrl}/activity-subscription`, {
      activityId: id
    });
  }
  unbookmarkActivity(id: number): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/activity-subscription`, {
      body: {
        activityId: id
      }
    });
  }

  bookmarkOffer(id: number): Observable<object> {
    return this.http.post(`${environment.apiUrl}/offer-subscription`, {
      offerId: id
    });
  }
  unbookmarkOffer(id: number): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/offer-subscription`, {
      body: {
        offerId: id
      }
    });
  }

  bookmarkBestPractice(id: number): Observable<object> {
    return this.http.post(`${environment.apiUrl}/bestPractice-subscription`, {
      bestPracticeId: id
    });
  }
  unbookmarkBestPractice(id: number): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/bestPractice-subscription`, {
      body: {
        bestPracticeId: id
      }
    });
  }
}
