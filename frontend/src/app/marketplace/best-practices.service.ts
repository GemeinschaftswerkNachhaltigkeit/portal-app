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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Status } from './models/status';
import { BestPracticesDto } from './models/best-practices-dto';
import { BestPracticesWipDto } from './models/best-practices-wip-dto';
import { BestPracticeApiService } from './api/best-practices-api.service';

export interface BestPracticesState {
  bestPractices: PagedResponse<BestPracticesDto> | null;
  bestPracticeWips: PagedResponse<BestPracticesWipDto> | null;
  loaders: Set<'bps' | 'wips'>;
}

interface FetchBestPracticesParams {
  orgId: number;
  paging?: PageQuerParams;
}

@Injectable({
  providedIn: 'root'
})
export class BestPracticesService {
  private api = inject(BestPracticeApiService);
  private feedback = inject(FeedbackService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private confirm = inject(ConfirmationService);
  private auth = inject(AuthService);

  // state
  private state = signal<BestPracticesState>({
    bestPractices: null,
    bestPracticeWips: null,
    loaders: new Set()
  });

  // subject
  private fetchBestPractices$ = new Subject<FetchBestPracticesParams>();
  private fetchBestPracticeWips$ = new Subject<FetchBestPracticesParams>();

  constructor() {
    this.fetchBestPractices();
    this.fetchBestPracticeWips();
  }

  // selectors
  readonly loading = computed(() => {
    return this.state().loaders.size > 0;
  });
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
  readonly bestPracticeWips = computed(() =>
    this.state().bestPracticeWips
      ? this.state().bestPracticeWips?.content
      : null
  );
  readonly bestPracticeWipsPaging = computed(() =>
    this.state().bestPracticeWips
      ? {
          number: this.state().bestPracticeWips?.number,
          size: this.state().bestPracticeWips?.size,
          totalElements: this.state().bestPracticeWips?.totalElements,
          totalPages: this.state().bestPracticeWips?.totalPages
        }
      : null
  );

  // actions

  getBestPractices(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'createdAt'
    }
  ) {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.fetchBestPractices$.next({
        orgId,
        paging
      });
    }
  }

  getBestPracticeWips(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'createdAt'
    }
  ) {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.fetchBestPracticeWips$.next({
        orgId,
        paging
      });
    }
  }

  changeBestPracticesPage(page: number, size: number): void {
    this.getBestPractices({ page: page, size: size, sort: 'createdAt' });
  }

  changeBestPracticeWipsPage(page: number, size: number): void {
    this.getBestPracticeWips({ page: page, size: size, sort: 'createdAt' });
  }

  private setBestPractices(
    bestPractices: PagedResponse<BestPracticesDto> | null
  ) {
    this.state.update((state) => ({
      ...state,
      bestPractices: bestPractices
    }));
  }

  private setBpWips(
    bestPracticeWips: PagedResponse<BestPracticesWipDto> | null
  ) {
    this.state.update((state) => ({
      ...state,
      bestPracticeWips: bestPracticeWips
    }));
  }

  private startLoading(type: 'bps' | 'wips') {
    this.state.update((state) => {
      const loaders = state.loaders.add(type);
      return {
        ...state,
        loading: new Set(loaders)
      };
    });
  }

  private stopLoading(type: 'bps' | 'wips') {
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

  private fetchBestPractices() {
    this.fetchBestPractices$
      .pipe(
        tap(() => this.startLoading('bps')),
        switchMap(({ orgId, paging }) =>
          this.api.getPagedBestPractices(orgId, paging)
        ),
        takeUntilDestroyed(),
        catchError(() => of(null))
      )
      .subscribe((bestPractices) => {
        this.setBestPractices(bestPractices);
        this.stopLoading('bps');
      });
  }

  private fetchBestPracticeWips() {
    this.fetchBestPracticeWips$
      .pipe(
        tap(() => this.startLoading('wips')),
        switchMap(({ orgId, paging }) =>
          this.api.getPagedBestPracticeWips(orgId, paging)
        ),
        takeUntilDestroyed(),
        catchError(() => of(null))
      )
      .subscribe((wips) => {
        this.setBpWips(wips);
        this.stopLoading('wips');
      });
  }

  newBestPractice(): void {
    const user = this.auth.getUser();
    if (user && user.orgId) {
      const orgId = user.orgId;
      this.api
        .createBestPractice(orgId)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate([
              '/',
              'marketplace',
              'best-practices',
              orgId,
              uuid
            ]);
          },
          error: (e) => {
            console.log(e);
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
      this.api
        .updateBestPractice(orgId, bestPractice.id)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => {
            this.router.navigate(
              ['/', 'marketplace', 'best-practices', orgId, uuid],
              {
                queryParams: { edit: true }
              }
            );
          },
          error: (e) => {
            console.log(e);
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
            this.api
              .deleteBestPractice(orgId, bestPracticeId)
              .pipe(take(1))
              .subscribe({
                next: () => this.getBestPractices()
              });
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
            this.api
              .deleteBestPracticeWip(orgId, uuid)
              .pipe(take(1))
              .subscribe({
                next: () => this.getBestPracticeWips()
              });
          }
        });
    }
  }

  setStatus(bestPractice: BestPracticesDto, status: Status): void {
    const user = this.auth.getUser();
    if (user && user.orgId && bestPractice.id) {
      const orgId = user.orgId;
      const bestPracticeId = bestPractice.id;
      this.api
        .setStatus(orgId, bestPracticeId, status)
        .pipe(take(1))
        .subscribe({
          next: () => this.getBestPractices(),
          error: (e) => {
            console.log(e);
          }
        });
    }
  }
}
