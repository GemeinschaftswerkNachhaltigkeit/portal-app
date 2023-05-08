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
import { BestPracticeApiService } from './api/best-practices-api.service';
import { BestPracticesDto } from './models/best-practices-dto';
import { BestPracticesWipDto } from './models/best-practices-wip-dto';
import { Status } from './models/status';

import { BestPracticesStateService } from './state/best-practices-state.service';

@Injectable({
  providedIn: 'root'
})
export class BestPracticesFacadeService {
  constructor(
    private auth: AuthService,
    private bestPracticesApi: BestPracticeApiService,
    private bestPracticesState: BestPracticesStateService,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private router: Router,
    private loader: LoadingService,
    private confirm: ConfirmationService
  ) {}

  get tokenRefresh$(): Observable<unknown> {
    return this.auth.tokenRefresh$;
  }

  get bestPracticesWip$(): Observable<BestPracticesWipDto | null> {
    return this.bestPracticesState.bestPracticesWip$;
  }

  get token(): string {
    return this.auth.getAccessToken();
  }

  get bestPractices$(): Observable<BestPracticesDto[]> {
    return this.bestPracticesState.bestPractices$;
  }
  get bestPracticeWips$(): Observable<BestPracticesWipDto[]> {
    return this.bestPracticesState.bestPracticeWips$;
  }

  get bestPracticesPaging$(): Observable<Paging> {
    return this.bestPracticesState.bestPracticesPaging$;
  }

  get bestPracticeWipsPaging$(): Observable<Paging> {
    return this.bestPracticesState.bestPracticeWipsPaging$;
  }

  newBestPractice(): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.bestPracticesApi
        .createBestPractice(orgId)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate([
              '/',
              'account',
              'best-practices',
              orgId,
              uuid
            ]);
          },
          error: () => {
            //
          }
        });
    }
  }

  editBestPracticeWip(bestPracticeWip: BestPracticesWipDto): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.router.navigate(
        [
          '/',
          'marketplace',
          'best-practices',
          orgId,
          bestPracticeWip.randomUniqueId
        ],
        { queryParams: { edit: true } }
      );
    }
  }

  editBestPractice(bestPractice: BestPracticesDto): void {
    const user = this.auth.getUser();
    if (user && user.orgId && bestPractice.id) {
      const orgId = user.orgId;
      this.bestPracticesApi
        .updateBestPractice(orgId, bestPractice.id)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate(
              ['/', 'marketplace', 'best-practices', orgId, uuid],
              { queryParams: { edit: true } }
            );
          },
          error: () => {
            //
          }
        });
    }
  }

  deleteBestPracticeWip(bestPracticeWip: BestPracticesWipDto): void {
    const ref = this.confirm.open({
      title: this.translate.instant('marketplace.titles.deleteBestPractice'),
      description: this.translate.instant(
        'marketplace.texts.deleteBestPractice'
      ),
      button: this.translate.instant('btn.delete')
    });
    const user = this.auth.getUser();
    if (user && user.orgId && bestPracticeWip.randomUniqueId) {
      const orgId = user.orgId;
      const uuid = bestPracticeWip.randomUniqueId;
      ref
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.bestPracticesApi
              .deleteBestPracticeWip(orgId, uuid)
              .pipe(take(1))
              .subscribe({
                next: () => this.loadBestPracticeWips()
              });
          }
        });
    }
  }

  deleteBestPractice(bestPractice: BestPracticesDto): void {
    const ref = this.confirm.open({
      title: this.translate.instant('marketplace.titles.deleteBestPractice'),
      description: this.translate.instant(
        'marketplace.texts.deleteBestPractice'
      ),
      button: this.translate.instant('marketplace.buttons.deleteBestPractice')
    });
    const user = this.auth.getUser();
    if (user && user.orgId && bestPractice.id) {
      const orgId = user.orgId;
      const bestPracticeId = bestPractice.id;
      ref
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.bestPracticesApi
              .deleteBestPractice(orgId, bestPracticeId)
              .pipe(take(1))
              .subscribe({
                next: () => this.loadBestPractices()
              });
          }
        });
    }
  }

  getBestPracticesWip(orgId: number, uuid: string): void {
    this.loader.start('best-practice-loading');
    this.bestPracticesApi
      .getBestPracticesWip(orgId, uuid)
      .pipe(take(1))
      .subscribe({
        next: (wip) => {
          this.bestPracticesState.setBestPracticesWip(wip);
          this.loader.stop('best-practice-loading');
        },
        error: () => {
          this.loader.stop('best-practice-loading');
        }
      });
  }

  saveBestPracticesWip(
    orgId: number,
    uuid: string,
    bestPracticeWip: BestPracticesWipDto
  ): void {
    this.bestPracticesApi
      .saveBestPracticesWip(orgId, uuid, bestPracticeWip)
      .pipe(take(1))
      .subscribe();
  }

  releaseBestPracticesWip(
    orgId: number,
    uuid: string,
    bestPracticeWip: BestPracticesWipDto
  ): void {
    this.bestPracticesApi
      .releaseBestPracticesWip(orgId, uuid, bestPracticeWip)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadBestPracticesAndBestPracticeWips();
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
    this.bestPracticesApi
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

  loadBestPracticesAndBestPracticeWips(): void {
    this.loader.start('load-all-bestPractices');

    this.loadBestPractices();
    this.loadBestPracticeWips();
  }

  changeBestPracticesPage(page: number, size: number): void {
    this.loadBestPractices({ page: page, size: size });
  }

  changeBestPracticeWipsPage(page: number, size: number): void {
    this.loadBestPracticeWips({ page: page, size: size });
  }

  setStatus(bestPractice: BestPracticesDto, status: Status): void {
    const user = this.auth.getUser();
    if (user && user.orgId && bestPractice.id) {
      const orgId = user.orgId;
      const bestPracticeId = bestPractice.id;
      this.bestPracticesApi
        .setStatus(orgId, bestPracticeId, status)
        .pipe(take(1))
        .subscribe({
          next: () => this.loadBestPractices(),
          error: (e) => {
            console.log(e);
          }
        });
    }
  }

  private loadBestPractices(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'createdAt'
    }
  ): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.bestPracticesApi
        .getPagedBestPractices(orgId, paging)
        .pipe(take(1))
        .subscribe({
          next: (bestPractices: PagedResponse<BestPracticesDto>) => {
            this.bestPracticesState.setBestPracticesResponse(bestPractices);
            this.loader.stop('load-all-bestPractices');
          },
          error: () => {
            this.loader.stop('load-all-bestPractices');
          }
        });
    }
  }

  private loadBestPracticeWips(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize
    }
  ): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.bestPracticesApi
        .getPagedBestPracticeWips(orgId, paging)
        .pipe(take(1))
        .subscribe({
          next: (bestPracticeWips: PagedResponse<BestPracticesDto>) => {
            this.bestPracticesState.setBestPracticesWipsResponse(
              bestPracticeWips
            );
            this.loader.stop('load-all-bestPractices');
          },
          error: () => {
            this.loader.stop('load-all-bestPractices');
          }
        });
    }
  }
}
