import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { AccountContentStateService } from './state/account-content-state.service';
import {
  AccountContentApiService,
  DanHelpModalContent
} from './api/account-content-api.service';

@Injectable()
export class AccountContentFacadeService implements OnDestroy {
  private unsubscribe$ = new Subject();

  constructor(
    private api: AccountContentApiService,
    private state: AccountContentStateService,
    private translate: TranslateService
  ) {
    this.init();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  get danHelpModal$(): Observable<DanHelpModalContent | null> {
    return this.state.danHelpModal$;
  }

  private loadDanHelpModalContent(): void {
    this.api
      .getDanHelpModalContent()
      .pipe(take(1))
      .subscribe({
        next: (content) => {
          this.state.setDanHelpModal(content);
        },
        error: () => {
          this.state.clearDanHelpModal();
        }
      });
  }

  private init(): void {
    this.loadDanHelpModalContent();
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.loadDanHelpModalContent();
      });
  }
}
