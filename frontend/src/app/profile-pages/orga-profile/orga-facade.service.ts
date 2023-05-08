import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { OrgaApiService } from './api/orga-api.service';
import Activity from '../../shared/models/actvitiy';
import Organisation from '../../shared/models/organisation';
import { ActivityStateService } from './state/activity-state.service';
import { OrgaStateService } from './state/orga-state.service';
import {
  PageQuerParams,
  defaultPaginatorOptions
} from 'src/app/shared/models/paging';
import { OffersStateService } from './state/offers-state.service';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { BpStateService } from './state/bp-state.service';

@Injectable({
  providedIn: 'root'
})
export class OrgaFacadeService {
  activites$ = this.activityState.activities$;
  offers$ = this.offersState.offers$;
  bp$ = this.bpState.bestPractices$;
  activitiesPaging$ = this.activityState.activitiesPaging$;
  offersPaging$ = this.offersState.offersPaging$;
  bpPaging$ = this.bpState.bestPracticesPaging$;

  constructor(
    private orgaApi: OrgaApiService,
    private orgaState: OrgaStateService,
    private activityState: ActivityStateService,
    private offersState: OffersStateService,
    private bpState: BpStateService,
    private loading: LoadingService
  ) {}

  get orga$(): Observable<Organisation | null> {
    return this.orgaState.orga$;
  }

  get organisationData(): Organisation | null {
    return this.orgaState.orga;
  }

  getById(id: number): void {
    this.orgaState.setOrga(null);
    const loadingId = this.loading.start();
    this.orgaApi
      .byId(id)
      .pipe(take(1))
      .subscribe({
        next: (orga: Organisation) => {
          this.orgaState.setOrga(orga);
          this.loading.stop(loadingId);
        },
        error: () => {
          this.loading.stop(loadingId);
        }
      });
    this.getActivitesForOrga(id);
    this.getOffersForOrga(id);
    this.getBestPracticesForOrga(id);
  }

  getActivitesForOrga(
    orgaId: number,
    paging: PageQuerParams = {
      size: 2000, //defaultPaginatorOptions.pageSize,
      sort: 'period.end,desc'
    }
  ): void {
    this.loading.start('activitiesLoading');
    this.orgaApi
      .activites(orgaId, paging)
      .pipe(take(1))
      .subscribe({
        next: (activitiesResp: PagedResponse<Activity>) => {
          this.activityState.setActivitiesResponse(activitiesResp);
          this.loading.stop('activitiesLoading');
        },
        error: () => {
          this.loading.stop('activitiesLoading');
        }
      });
  }

  getOffersForOrga(
    orgaId: number,
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize
    }
  ): void {
    this.loading.start('offersLoading');
    this.orgaApi
      .offers(orgaId, { size: 2000 })
      .pipe(take(1))
      .subscribe({
        next: (offersResp: PagedResponse<OfferDto>) => {
          this.offersState.setOffersResponse(offersResp);
          this.loading.stop('offersLoading');
        },
        error: () => {
          this.loading.stop('offersLoading');
        }
      });
  }
  getBestPracticesForOrga(
    orgaId: number,
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize
    }
  ): void {
    this.loading.start('bestPracticesLoading');
    this.orgaApi
      .bestPractices(orgaId, { size: 2000 })
      .pipe(take(1))
      .subscribe({
        next: (offersResp: PagedResponse<BestPracticesDto>) => {
          this.bpState.setBestPracticesResponse(offersResp);
          this.loading.stop('bestPracticesLoading');
        },
        error: () => {
          this.loading.stop('bestPracticesLoading');
        }
      });
  }
}
