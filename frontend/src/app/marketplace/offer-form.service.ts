import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { FeedbackService } from '../shared/components/feedback/feedback.service';

import { OffersApiService } from './api/offers-api.service';
import { OfferWipDto } from './models/offer-wip-dto';
import { OffersService } from './offers.service';

export interface OffersState {
  offerWip: OfferWipDto | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OfferFormService {
  private api = inject(OffersApiService);
  private feedback = inject(FeedbackService);
  private translate = inject(TranslateService);
  private auth = inject(AuthService);
  private offersService = inject(OffersService);

  // state
  private state = signal<OffersState>({
    offerWip: null,
    loading: false
  });

  constructor() {}

  // selectors

  readonly loading = computed(() => this.state().loading);
  readonly offerWip = computed(() => this.state().offerWip);

  // actions

  get token(): string {
    return this.auth.getAccessToken();
  }

  private setOfferWip(offerWip: OfferWipDto | null) {
    this.state.update((state) => ({
      ...state,
      offerWip: offerWip
    }));
  }

  private startLoading() {
    this.state.update((state) => {
      return {
        ...state,
        loading: true
      };
    });
  }

  private stopLoading() {
    this.state.update((state) => {
      return {
        ...state,
        loading: false
      };
    });
  }

  // async

  getOffersWip(orgId: number, uuid: string): void {
    this.startLoading();
    this.api
      .getOffersWip(orgId, uuid)
      .pipe(take(1))
      .subscribe((wip) => {
        this.setOfferWip(wip);
        this.stopLoading();
      });
  }

  saveOffersWip(orgId: number, uuid: string, offerWip: OfferWipDto): void {
    this.api.saveOffersWip(orgId, uuid, offerWip).pipe(take(1)).subscribe();
  }

  releaseOffersWip(orgId: number, uuid: string, offerWip: OfferWipDto): void {
    this.api
      .releaseOffersWip(orgId, uuid, offerWip)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.offersService.getOffers();
          this.offersService.getOfferWips();
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
    this.api
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
}
