import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PartnerLinksContentService } from './api/partner-links-content.service';
import { PartnerLink } from './models/partner-link';
import { TranslateService } from '@ngx-translate/core';

type MarketplaceContentState = {
  partners: PartnerLink[];
};

@Injectable({
  providedIn: 'root'
})
export class MarketplaceContentService {
  private partnerContent = inject(PartnerLinksContentService);
  private translate = inject(TranslateService);

  // state
  private state = signal<MarketplaceContentState>({
    partners: []
  });

  // subjects
  private fetchPartners$ = new Subject();

  // selectors
  readonly partners = computed(() => this.state().partners);

  constructor() {
    this.fetchPartners();
    this.translate.onLangChange.subscribe(() => {
      this.getPartners();
    });
  }

  // actions

  getPartners() {
    this.fetchPartners$.next(null);
  }

  private setPartners(partners: PartnerLink[]) {
    this.state.update((state) => ({
      ...state,
      partners: partners
    }));
  }

  // async

  private fetchPartners(): void {
    this.fetchPartners$
      .pipe(
        switchMap(() => this.partnerContent.getPartnerLinks()),
        takeUntilDestroyed(),
        catchError(() => of([]))
      )
      .subscribe((partners) => {
        this.setPartners(partners);
      });
  }
}
