import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import { OrgaApiService } from './orga-api.service';
import Activity from '../../../shared/models/actvitiy';
import Organisation from '../../../shared/models/organisation';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type LoadingStates = 'organisation' | 'offers' | 'bestPractices' | 'activities';

interface OrgaProfileState {
  organisation: Organisation | null;
  activities: PagedResponse<Activity> | null;
  offers: PagedResponse<OfferDto> | null;
  bestPractices: PagedResponse<BestPracticesDto> | null;
  loaders: Set<LoadingStates>;
}

@Injectable({
  providedIn: 'root'
})
export class OrgaService {
  private api = inject(OrgaApiService);

  // state

  private state = signal<OrgaProfileState>({
    organisation: null,
    activities: null,
    offers: null,
    bestPractices: null,
    loaders: new Set()
  });

  // subjects
  private fetchOrganisationById$ = new Subject<number>();

  constructor() {
    this.fetchOrganisationById();
    this.fetchActivitesForOrga();
    this.fetchOffersForOrga();
    this.fetchBestPracticesForOrga();
  }

  // selectors
  readonly organisation = computed(() => this.state().organisation);
  readonly activities = computed(() =>
    this.state().activities ? this.state().activities?.content : null
  );
  readonly activitiesPaging = computed(() =>
    this.state().activities
      ? {
          number: this.state().activities?.number,
          size: this.state().activities?.size,
          totalElements: this.state().activities?.totalElements,
          totalPages: this.state().activities?.totalPages
        }
      : null
  );
  readonly offers = computed(() =>
    this.state().offers ? this.state().offers?.content : null
  );
  readonly offersPaging = computed(() =>
    this.state().offers
      ? {
          number: this.state().offers?.number,
          size: this.state().offers?.size,
          totalElements: this.state().offers?.totalElements,
          totalPages: this.state().offers?.totalPages
        }
      : null
  );
  readonly bestPractices = computed(() =>
    this.state().bestPractices ? this.state().bestPractices?.content : null
  );
  readonly bestPracticesPaging = computed(() =>
    this.state().bestPractices
      ? {
          number: this.state().bestPractices?.number,
          size: this.state().bestPractices?.size,
          totalElements: this.state().bestPractices?.totalElements,
          totalPages: this.state().bestPractices?.totalPages
        }
      : null
  );
  readonly loading = computed(() => {
    return this.state().loaders.size > 0;
  });

  hasLoader(loader: LoadingStates) {
    return this.state().loaders.has(loader);
  }

  // actions
  setOrganisation(organisation: Organisation | null): void {
    this.state.update((state) => ({
      ...state,
      organisation: organisation
    }));
  }

  setActivitiesResponse(activities: PagedResponse<Activity>): void {
    this.state.update((state) => ({
      ...state,
      activities: activities
    }));
  }

  setOffersResponse(offers: PagedResponse<OfferDto>): void {
    this.state.update((state) => ({
      ...state,
      offers: offers
    }));
  }

  setBestPracticesResponse(
    bestPractices: PagedResponse<BestPracticesDto>
  ): void {
    this.state.update((state) => ({
      ...state,
      bestPractices: bestPractices
    }));
  }

  private startLoading(type: LoadingStates) {
    this.state.update((state) => {
      const loaders = state.loaders.add(type);
      return {
        ...state,
        loading: new Set(loaders)
      };
    });
  }

  private stopLoading(type: LoadingStates) {
    this.state.update((state) => {
      const loaders = new Set(state.loaders);
      loaders.delete(type);
      return {
        ...state,
        loaders: new Set(loaders)
      };
    });
  }

  getOrganisationById(id: number) {
    this.fetchOrganisationById$.next(id);
  }

  // async
  fetchOrganisationById() {
    this.fetchOrganisationById$
      .pipe(
        tap(() => this.startLoading('organisation')),
        switchMap((id) => this.api.byId(id)),
        takeUntilDestroyed(),
        catchError((err) => {
          console.log(err);
          this.stopLoading('organisation');
          return EMPTY;
        })
      )
      .subscribe((organisation) => {
        this.stopLoading('organisation');
        this.setOrganisation(organisation);
      });
  }

  fetchActivitesForOrga() {
    this.fetchOrganisationById$
      .pipe(
        tap(() => this.startLoading('activities')),
        switchMap((id) => this.api.activites(id, { size: 2000 })),
        takeUntilDestroyed(),
        catchError((err) => {
          console.log(err);
          this.stopLoading('activities');
          return EMPTY;
        })
      )
      .subscribe((activities) => {
        this.stopLoading('activities');
        this.setActivitiesResponse(activities);
      });
  }

  fetchOffersForOrga() {
    this.fetchOrganisationById$
      .pipe(
        tap(() => this.startLoading('offers')),
        switchMap((id) => this.api.offers(id, { size: 2000 })),
        takeUntilDestroyed(),
        catchError((err) => {
          console.log(err);
          this.stopLoading('offers');
          return EMPTY;
        })
      )
      .subscribe((offers) => {
        this.stopLoading('offers');
        this.setOffersResponse(offers);
      });
  }

  fetchBestPracticesForOrga() {
    this.fetchOrganisationById$
      .pipe(
        tap(() => this.startLoading('bestPractices')),
        switchMap((id) => this.api.bestPractices(id, { size: 2000 })),
        takeUntilDestroyed(),
        catchError((err) => {
          console.log(err);
          this.stopLoading('bestPractices');
          return EMPTY;
        })
      )
      .subscribe((bestPractices) => {
        this.stopLoading('bestPractices');
        this.setBestPracticesResponse(bestPractices);
      });
  }
}
