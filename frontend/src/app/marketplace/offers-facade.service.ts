import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmationService } from '../core/services/confirmation.service';
import { FeedbackService } from '../shared/components/feedback/feedback.service';
import PagedResponse from '../shared/models/paged-response';
import Paging, {
  PageQuerParams,
  defaultPaginatorOptions
} from '../shared/models/paging';

import { LoadingService } from '../shared/services/loading.service';
import { OffersApiService } from './api/offers-api.service';
import { OfferDto } from './models/offer-dto';
import { OfferWipDto } from './models/offer-wip-dto';
import { Status } from './models/status';
import { OffersStateService } from './state/offers-state.service';

@Injectable({
  providedIn: 'root'
})
export class OffersFacadeService {
  constructor(
    private auth: AuthService,
    private offersApi: OffersApiService,
    private offersState: OffersStateService,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private router: Router,
    private loader: LoadingService,
    private confirm: ConfirmationService
  ) {}

  get tokenRefresh$(): Observable<unknown> {
    return this.auth.tokenRefresh$;
  }

  get offersWip$(): Observable<OfferWipDto | null> {
    return this.offersState.offersWip$;
  }

  get token(): string {
    return this.auth.getAccessToken();
  }

  get offers$(): Observable<OfferDto[]> {
    return this.offersState.offers$;
  }
  get offerWips$(): Observable<OfferWipDto[]> {
    return this.offersState.offerWips$;
  }

  get offersPaging$(): Observable<Paging> {
    return this.offersState.offersPaging$;
  }

  get offerWipsPaging$(): Observable<Paging> {
    return this.offersState.offerWipsPaging$;
  }

  newOffer(): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.offersApi
        .createOffer(orgId)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate(['/', 'marketplace', 'offers', orgId, uuid]);
          },
          error: () => {
            //
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
      this.offersApi
        .updateOffer(orgId, offer.id)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate(['/', 'marketplace', 'offers', orgId, uuid], {
              queryParams: { edit: true }
            });
          },
          error: () => {
            //
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
            this.offersApi
              .deleteOfferWip(orgId, uuid)
              .pipe(take(1))
              .subscribe({
                next: () => this.loadOfferWips()
              });
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
            this.offersApi
              .deleteOffer(orgId, offerId)
              .pipe(take(1))
              .subscribe({
                next: () => this.loadOffers()
              });
          }
        });
    }
  }

  getOffersWip(orgId: number, uuid: string): void {
    this.loader.start('offer-loading');
    this.offersApi
      .getOffersWip(orgId, uuid)
      .pipe(take(1))
      .subscribe({
        next: (wip) => {
          this.offersState.setOfferWip(wip);
          this.loader.stop('offer-loading');
        },
        error: () => {
          this.loader.stop('offer-loading');
        }
      });
  }

  saveOffersWip(orgId: number, uuid: string, offerWip: OfferWipDto): void {
    this.offersApi
      .saveOffersWip(orgId, uuid, offerWip)
      .pipe(take(1))
      .subscribe();
  }

  releaseOffersWip(orgId: number, uuid: string, offerWip: OfferWipDto): void {
    this.offersApi
      .releaseOffersWip(orgId, uuid, offerWip)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadOffersAndOfferWips();
          this.feedback.showFeedback(
            this.translate.instant(
              'marketplace.notifications.createOfferSuccess'
            )
          );
        },
        error: (error) => {
          if (error.status === 409) {
            this.feedback.showFeedback(
              this.translate.instant('error.itemLimit'),
              'error'
            );
          } else {
            this.feedback.showFeedback(
              this.translate.instant('error.unknown'),
              'error'
            );
          }
        }
      });
  }

  deleteImage(orgId: number, uuid: string): void {
    this.offersApi
      .deleteOfferImage(orgId, uuid)
      .pipe(take(1))
      .subscribe({
        next: () => {
          //
        },
        error: () => {
          //
        }
      });
  }

  loadOffersAndOfferWips(): void {
    this.loader.start('load-all-offers');

    this.loadOffers();
    this.loadOfferWips();
  }

  changeOffersPage(page: number, size: number): void {
    this.loadOffers({ page: page, size: size });
  }

  changeOfferWipsPage(page: number, size: number): void {
    this.loadOfferWips({ page: page, size: size });
  }

  setStatus(offer: OfferDto, status: Status): void {
    const user = this.auth.getUser();
    if (user && user.orgId && offer.id) {
      const orgId = user.orgId;
      const offerId = offer.id;
      this.offersApi
        .setStatus(orgId, offerId, status)
        .pipe(take(1))
        .subscribe({
          next: () => this.loadOffers(),
          error: (e) => {
            console.log(e);
          }
        });
    }
  }

  private loadOffers(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'createdAt'
    }
  ): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.offersApi
        .getPagedOffers(orgId, paging)
        .pipe(take(1))
        .subscribe({
          next: (offers: PagedResponse<OfferDto>) => {
            this.offersState.setOffersResponse(offers);
            this.loader.stop('load-all-offers');
          },
          error: () => {
            this.loader.stop('load-all-offers');
          }
        });
    }
  }

  private loadOfferWips(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize
    }
  ): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.offersApi
        .getPagedOfferWips(orgId, paging)
        .pipe(take(1))
        .subscribe({
          next: (offerWips: PagedResponse<OfferDto>) => {
            this.offersState.setOfferWipsResponse(offerWips);
            this.loader.stop('load-all-offers');
          },
          error: () => {
            this.loader.stop('load-all-offers');
          }
        });
    }
  }
}
