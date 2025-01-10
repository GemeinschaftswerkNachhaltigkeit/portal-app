import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, of, Subject, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmationService } from '../shared/services/confirmation.service';
import { FeedbackService } from '../shared/components/feedback/feedback.service';
import PagedResponse from '../shared/models/paged-response';
import {
  PageQuerParams,
  defaultPaginatorOptions
} from '../shared/models/paging';

import { OffersApiService } from './api/offers-api.service';
import { OfferDto } from './models/offer-dto';
import { OfferWipDto } from './models/offer-wip-dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Status } from './models/status';

export interface OffersState {
  offers: PagedResponse<OfferDto> | null;
  offerWips: PagedResponse<OfferWipDto> | null;
  loaders: Set<'offers' | 'wips'>;
}

interface FetchOffersParams {
  orgId: number;
  paging?: PageQuerParams;
}

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private api = inject(OffersApiService);
  private feedback = inject(FeedbackService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private confirm = inject(ConfirmationService);
  private auth = inject(AuthService);

  // get tokenRefresh$(): Observable<unknown> {
  //   return this.auth.tokenRefresh$;
  // }

  // state
  private state = signal<OffersState>({
    offers: null,
    offerWips: null,
    loaders: new Set()
  });

  // subject
  private fetchOffers$ = new Subject<FetchOffersParams>();
  private fetchOfferWips$ = new Subject<FetchOffersParams>();

  constructor() {
    this.fetchOffers();
    this.fetchOfferWips();
  }

  // selectors
  readonly loading = computed(() => {
    console.log('loaders', this.state().loaders);
    return this.state().loaders.size > 0;
  });
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
  readonly offerWips = computed(() =>
    this.state().offerWips ? this.state().offerWips?.content : null
  );
  readonly offerWipsPaging = computed(() =>
    this.state().offerWips
      ? {
          number: this.state().offerWips?.number,
          size: this.state().offerWips?.size,
          totalElements: this.state().offerWips?.totalElements,
          totalPages: this.state().offerWips?.totalPages
        }
      : null
  );

  // actions

  getOffers(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'createdAt'
    }
  ) {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.fetchOffers$.next({
        orgId,
        paging
      });
    }
  }

  getOfferWips(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'createdAt'
    }
  ) {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.fetchOfferWips$.next({
        orgId,
        paging
      });
    }
  }

  changeOffersPage(page: number, size: number): void {
    this.getOffers({ page: page, size: size, sort: 'createdAt' });
  }

  changeOfferWipsPage(page: number, size: number): void {
    this.getOfferWips({ page: page, size: size, sort: 'createdAt' });
  }

  private setOffers(offers: PagedResponse<OfferDto> | null) {
    this.state.update((state) => ({
      ...state,
      offers: offers
    }));
  }

  private setOfferWips(offerWips: PagedResponse<OfferWipDto> | null) {
    this.state.update((state) => ({
      ...state,
      offerWips: offerWips
    }));
  }

  private startLoading(type: 'offers' | 'wips') {
    this.state.update((state) => {
      const loaders = state.loaders.add(type);
      return {
        ...state,
        loading: new Set(loaders)
      };
    });
  }

  private stopLoading(type: 'offers' | 'wips') {
    console.log('Stop loading', type);
    this.state.update((state) => {
      const loaders = new Set(state.loaders);
      loaders.delete(type);
      return {
        ...state,
        loaders: new Set(loaders)
      };
    });
  }

  // async

  private fetchOffers() {
    this.fetchOffers$
      .pipe(
        tap(() => this.startLoading('offers')),
        switchMap(({ orgId, paging }) =>
          this.api.getPagedOffers(orgId, paging)
        ),
        takeUntilDestroyed(),
        catchError(() => of(null))
      )
      .subscribe((offers) => {
        this.setOffers(offers);
        this.stopLoading('offers');
      });
  }

  private fetchOfferWips() {
    this.fetchOfferWips$
      .pipe(
        tap(() => this.startLoading('wips')),
        switchMap(({ orgId, paging }) =>
          this.api.getPagedOfferWips(orgId, paging)
        ),
        takeUntilDestroyed(),
        catchError(() => of(null))
      )
      .subscribe((wips) => {
        this.setOfferWips(wips);
        this.stopLoading('wips');
      });
  }

  newOffer(): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.api
        .createOffer(orgId)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate(['/', 'marketplace', 'offers', orgId, uuid]);
          },
          error: (e) => {
            console.log(e);
          }
        });
    }
  }

  editOfferWip(offerWip: OfferWipDto): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.router.navigate(
        ['/', 'marketplace', 'offers', orgId, offerWip.randomUniqueId],
        { queryParams: { edit: true } }
      );
    }
  }

  editOffer(offer: OfferDto): void {
    const user = this.auth.getUser();
    if (user && user.orgId && offer.id) {
      const orgId = user.orgId;
      this.api
        .updateOffer(orgId, offer.id)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate(['/', 'marketplace', 'offers', orgId, uuid], {
              queryParams: { edit: true }
            });
          },
          error: (e) => {
            console.log(e);
          }
        });
    }
  }

  deleteOffer(offer: OfferDto): void {
    const ref = this.confirm.open({
      title: this.translate.instant('marketplace.titles.deleteOffer'),
      description: this.translate.instant('marketplace.texts.deleteOffer'),
      button: this.translate.instant('marketplace.buttons.deleteOffer')
    });
    const user = this.auth.getUser();
    if (user && user.orgId && offer.id) {
      const orgId = user.orgId;
      const offerId = offer.id;
      ref
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.api
              .deleteOffer(orgId, offerId)
              .pipe(take(1))
              .subscribe({
                next: () => this.getOffers()
              });
          }
        });
    }
  }

  deleteOfferWip(offerWip: OfferWipDto): void {
    const ref = this.confirm.open({
      title: this.translate.instant('marketplace.titles.deleteOffer'),
      description: this.translate.instant('marketplace.texts.deleteOffer'),
      button: this.translate.instant('btn.delete')
    });
    const user = this.auth.getUser();
    if (user && user.orgId && offerWip.randomUniqueId) {
      const orgId = user.orgId;
      const uuid = offerWip.randomUniqueId;
      ref
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.api
              .deleteOfferWip(orgId, uuid)
              .pipe(take(1))
              .subscribe({
                next: () => this.getOfferWips()
              });
          }
        });
    }
  }

  setStatus(offer: OfferDto, status: Status): void {
    const user = this.auth.getUser();
    if (user && user.orgId && offer.id) {
      const orgId = user.orgId;
      const offerId = offer.id;
      this.api
        .setStatus(orgId, offerId, status)
        .pipe(take(1))
        .subscribe({
          next: () => this.getOffers(),
          error: (e) => {
            console.log(e);
          }
        });
    }
  }
}
