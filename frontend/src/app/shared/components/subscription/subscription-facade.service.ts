import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RegisterOrLoginService } from 'src/app/core/services/register-or-login.service.service';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import Activity from '../../models/actvitiy';
import Organisation from '../../models/organisation';
import PagedResponse from '../../models/paged-response';
import { LoadingService } from '../../services/loading.service';
import { SubscriptionApiService } from './api/subscription-api.service';
import { SubscriptionActivityStateService } from './state/subscription-activity-state.service';
import { SubscriptionBestPracticeStateService } from './state/subscription-best-practice-state.service';
import { SubscriptionOfferStateService } from './state/subscription-offer-state.service';
import { SubscriptionOrganisationStateService } from './state/subscription-organisation-state.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionFacadeService {
  constructor(
    private registerOrLogin: RegisterOrLoginService,
    private subscriptionApi: SubscriptionApiService,
    private orgaState: SubscriptionOrganisationStateService,
    private activityState: SubscriptionActivityStateService,
    private offerState: SubscriptionOfferStateService,
    private bestPracticeState: SubscriptionBestPracticeStateService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private loader: LoadingService
  ) {
    this.auth.isDoneLoading$.subscribe((ready: boolean) => {
      if (ready && this.auth.isLoggedIn()) {
        this.initSubscriptionLists();
      }
    });
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const params = this.route.snapshot.queryParams;
        if (params['follow']) {
          this.finalizeFollowOrganisation(+params['follow']);
        }
        if (params['bookmark']) {
          this.finalizeBookmarkActivity(+params['bookmark']);
        }
        if (params['bookmark-offer']) {
          this.finalizeBookmarkOffer(+params['bookmark-offer']);
        }
        if (params['bookmark-best-practice']) {
          this.finalizeBookmarkBestPractice(+params['bookmark-best-practice']);
        }
      });
  }

  get organisationSubscriptions$(): Observable<Organisation[]> {
    return this.orgaState.organisationSubscriptions$;
  }

  get activitySubscriptions$(): Observable<Activity[]> {
    return this.activityState.activitySubscriptions$;
  }

  get offerSubscriptions$(): Observable<OfferDto[]> {
    return this.offerState.offerSubscriptions$;
  }

  get bestPracticeSubscriptions$(): Observable<Activity[]> {
    return this.bestPracticeState.bestPracticeSubscriptions$;
  }

  oganisationIsSubcribed(id?: number): boolean {
    return this.orgaState.oganisationIsSubcribed(id);
  }

  activityIsSubcribed(id?: number): boolean {
    return this.activityState.activityIsSubcribed(id);
  }

  offerIsSubcribed(id?: number): boolean {
    return this.offerState.offerIsSubcribed(id);
  }

  bestPracticeIsSubcribed(id?: number): boolean {
    return this.bestPracticeState.bestPracticeIsSubcribed(id);
  }

  followOrganisation(id: number, subtitle = ''): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeFollowOrganisation(id);
    } else {
      this.registerOrLogin.open({
        subtitle: subtitle,
        next: `${this.router.url}?follow=${id}`
      });
    }
  }

  finalizeFollowOrganisation(id: number): void {
    this.subscriptionApi.followOrganisation(id).subscribe({
      next: () => {
        this.loadOrganisationSubs();
      }
    });
  }

  unfollowOrganisation(id: number): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi.unfollowOrganisation(id).subscribe({
        next: () => {
          this.loadOrganisationSubs();
        }
      });
    }
  }

  bookmarkActivity(id: number, subtitle = ''): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeBookmarkActivity(id);
    } else {
      this.registerOrLogin.open({
        subtitle: subtitle,
        next: `${this.router.url}?bookmark=${id}`
      });
    }
  }

  finalizeBookmarkActivity(id: number): void {
    this.subscriptionApi.bookmarkActivity(id).subscribe({
      next: () => {
        this.loadActivitySubs();
      }
    });
  }

  unbookmarkActivity(id: number): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi.unbookmarkActivity(id).subscribe({
        next: () => {
          this.loadActivitySubs();
        }
      });
    }
  }

  bookmarkOffer(id: number, subtitle = ''): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeBookmarkOffer(id);
    } else {
      this.registerOrLogin.open({
        subtitle: subtitle,
        next: `${this.router.url}?bookmark-offer=${id}`
      });
    }
  }

  finalizeBookmarkOffer(id: number): void {
    this.subscriptionApi.bookmarkOffer(id).subscribe({
      next: () => {
        this.loadOfferSubs();
      }
    });
  }

  unbookmarkOffer(id: number): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi.unbookmarkOffer(id).subscribe({
        next: () => {
          this.loadOfferSubs();
        }
      });
    }
  }

  bookmarkBestPractice(id: number, subtitle = ''): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeBookmarkBestPractice(id);
    } else {
      this.registerOrLogin.open({
        subtitle: subtitle,
        next: `${this.router.url}?bookmark-best-practice=${id}`
      });
    }
  }

  finalizeBookmarkBestPractice(id: number): void {
    this.subscriptionApi.bookmarkBestPractice(id).subscribe({
      next: () => {
        this.loadBestPracticeSubs();
      }
    });
  }

  unbookmarkBestPractice(id: number): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi.unbookmarkBestPractice(id).subscribe({
        next: () => {
          this.loadBestPracticeSubs();
        }
      });
    }
  }

  private loadOrganisationSubs(): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi
        .fetchOrganisationSubscriptions({ size: 2000 })
        .pipe(take(1))
        .subscribe({
          next: (pagedResp: PagedResponse<{ organisation: Organisation }>) => {
            this.orgaState.setOrganisationSubscriptionsResp(pagedResp);
            this.loader.stop('load-orga-subs');
          },
          error: () => {
            this.loader.stop('load-orga-subs');
          }
        });
    }
  }

  private loadActivitySubs(): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi
        .fetchActivitiySubscriptions({ size: 2000 })
        .pipe(take(1))
        .subscribe({
          next: (pagedResp: PagedResponse<{ activity: Activity }>) => {
            this.activityState.setActivitySubscriptionsResp(pagedResp);
            this.loader.stop('load-acti-subs');
          },
          error: () => {
            this.loader.stop('load-acti-subs');
          }
        });
    }
  }

  private loadOfferSubs(): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi
        .fetchOfferSubscriptions({ size: 2000 })
        .pipe(take(1))
        .subscribe({
          next: (pagedResp: PagedResponse<{ offer: OfferDto }>) => {
            this.offerState.setOfferSubscriptionsResp(pagedResp);
            this.loader.stop('load-offers-subs');
          },
          error: () => {
            this.loader.stop('load-offers-subs');
          }
        });
    }
  }

  private loadBestPracticeSubs(): void {
    if (this.auth.isLoggedIn()) {
      this.subscriptionApi
        .fetchBestPracticeSubscriptions({ size: 2000 })
        .pipe(take(1))
        .subscribe({
          next: (
            pagedResp: PagedResponse<{ bestPractice: BestPracticesDto }>
          ) => {
            this.bestPracticeState.setBestPracticeSubscriptionsResp(pagedResp);
            this.loader.stop('load-best-practice-subs');
          },
          error: () => {
            this.loader.stop('load-best-practice-subs');
          }
        });
    }
  }

  private initSubscriptionLists(): void {
    this.loader.start('load-orga-subs');
    this.loader.start('load-acti-subs');
    // this.loader.start('load-offers-subs');
    // this.loader.start('load-best-practice-subs');
    this.loadOrganisationSubs();
    this.loadActivitySubs();
    // this.loadBestPracticeSubs();
    // this.loadOfferSubs();
  }
}
