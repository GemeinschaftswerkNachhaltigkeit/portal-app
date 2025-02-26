import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { FeedbackService } from '../shared/components/feedback/feedback.service';
import { BestPracticeApiService } from './api/best-practices-api.service';
import { BestPracticesService } from './best-practices.service';
import { BestPracticesWipDto } from './models/best-practices-wip-dto';

export interface BestPracticeState {
  bestPracticeWip: BestPracticesWipDto | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BestPracticeFormService {
  private api = inject(BestPracticeApiService);
  private feedback = inject(FeedbackService);
  private translate = inject(TranslateService);
  private auth = inject(AuthService);
  private bestPracticeService = inject(BestPracticesService);

  // state
  private state = signal<BestPracticeState>({
    bestPracticeWip: null,
    loading: false
  });

  constructor() {}

  // selectors

  readonly loading = computed(() => this.state().loading);
  readonly bestPracticeWip = computed(() => this.state().bestPracticeWip);

  // actions

  get token(): string {
    return this.auth.getAccessToken();
  }

  private setbestPracticeWip(bestPracticeWip: BestPracticesWipDto | null) {
    this.state.update((state) => ({
      ...state,
      bestPracticeWip: bestPracticeWip
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

  getBestPracticesWip(orgId: number, uuid: string): void {
    this.startLoading();
    this.api
      .getBestPracticesWip(orgId, uuid)
      .pipe(take(1))
      .subscribe((wip) => {
        this.setbestPracticeWip(wip);
        this.stopLoading();
      });
  }

  saveBestPracticesWip(
    orgId: number,
    uuid: string,
    bestPracticeWip: BestPracticesWipDto
  ): void {
    this.api
      .saveBestPracticesWip(orgId, uuid, bestPracticeWip)
      .pipe(take(1))
      .subscribe();
  }

  releaseBestPracticesWip(
    orgId: number,
    uuid: string,
    bestPracticeWip: BestPracticesWipDto
  ): void {
    this.api
      .releaseBestPracticesWip(orgId, uuid, bestPracticeWip)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.bestPracticeService.getBestPractices();
          this.bestPracticeService.getBestPracticeWips();
          this.feedback.showFeedback(
            this.translate.instant(
              'marketplace.notifications.createBestPracticeSuccess'
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
      .deleteBestPracticeImage(orgId, uuid)
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
