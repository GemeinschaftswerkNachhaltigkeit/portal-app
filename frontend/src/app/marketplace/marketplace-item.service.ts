import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, EMPTY, filter, Subject, switchMap, tap } from 'rxjs';
import { RegisterOrLoginService } from '../shared/services/register-or-login.service.service';
import { AuthService } from '../auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MarketplaceItemDto } from './models/marketplace-item-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { MarketplaceApiService } from './api/marketplace-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseError } from '../shared/components/base/error.component';

interface ItemState {
  item: MarketplaceItemDto | null;
  error: BaseError | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceItemService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private api = inject(MarketplaceApiService);
  private registerOrLogin = inject(RegisterOrLoginService);
  private translate = inject(TranslateService);

  // state
  private state = signal<ItemState>({
    item: null,
    error: null,
    loading: false
  });

  // subjects
  private fetchItem$ = new Subject<number>();

  // selectors

  item = computed(() => this.state().item);
  error = computed(() => this.state().error);
  loading = computed(() => this.state().loading);

  constructor() {
    this.handleAddItemAfterRouting();
    this.fetchItem();
  }

  // actions

  addNewMarketplaceItem(): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeAddNewMarketplaceItem();
    } else {
      this.registerOrLogin.open({
        title: this.translate.instant('marketplace.titles.addLoginModal'),
        subtitle: this.translate.instant('marketplace.texts.addLoginModal'),
        next: `${this.router.url}?add=true`
      });
    }
  }

  private finalizeAddNewMarketplaceItem(): void {
    const hasOrga = this.auth.userHasOrga();
    if (hasOrga) {
      this.router.navigate(['/', 'account']);
    }
    if (!hasOrga) {
      this.router.navigate(['/', 'account', 'my-organisation']);
    }
  }

  getItem(id: number) {
    this.fetchItem$.next(id);
  }

  private setItem(item: MarketplaceItemDto) {
    this.state.update((state) => ({
      ...state,
      item: item,
      loading: false
    }));
  }

  private startLoading() {
    this.state.update((state) => ({
      ...state,
      loading: true
    }));
  }

  private stopLoading() {
    this.state.update((state) => ({
      ...state,
      loading: false
    }));
  }

  private setError(err: HttpErrorResponse) {
    console.log('Err', err);
    this.state.update((state) => ({
      ...state,
      error: {
        message: this.getErrorMessage(err),
        status: err.status
      },
      loading: false
    }));
    return EMPTY;
  }

  // async
  private handleAddItemAfterRouting() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const params = this.route.snapshot.queryParams;
        if (params['add']) {
          this.finalizeAddNewMarketplaceItem();
        }
      });
  }

  private fetchItem(): void {
    this.fetchItem$
      .pipe(
        tap(() => this.startLoading()),
        switchMap((id: number) => {
          return this.api.getMarketplaceItem(id);
        }),
        takeUntilDestroyed(),
        catchError((err) => this.setError(err))
      )
      .subscribe((item) => {
        this.setItem(item);
      });
  }

  // helpers
  private getErrorMessage(err: HttpErrorResponse): string {
    console.log(err);
    return '';
  }
}
